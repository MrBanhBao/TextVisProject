import argparse
import json
import os
import sys

from gensim.corpora import Dictionary
from gensim.models import TfidfModel
import pandas as pd

from utils.tokenizer import tokenize_document


def parse_args():
    parser = argparse.ArgumentParser(description='Word bubble creator')
    parser.add_argument('left_idx', type=int)
    parser.add_argument('right_idx', type=int)
    parser.add_argument('output', nargs='?', default='bubbles.json')
    parser.add_argument('-d', '--dictionary', dest='dictionary', required=True)
    parser.add_argument('-t', '--tfidf', dest='tfidf', required=True)
    parser.add_argument('-s', '--stop_words', dest='stop_words')
    parser.add_argument('-n', '--number_of_tokens', dest='number_of_tokens', required=True, type=int)
    return parser.parse_args()


def read_text(file_path):
    with open(file_path, 'r') as file:
        for line in file:
            yield line.rstrip()


def most_important(tfidf_values, n_tokens):
    return {idx: value for idx, value in sorted(tfidf_values, key=lambda x: x[1], reverse=True)[:n_tokens]}


def get_frequencies(bag_of_words, keys):
    return {idx: count for idx, count in bag_of_words if idx in keys}


def write_as_json(bubbles, output_path):
    with open(output_path, 'w') as output_file:
        output_file.write(json.dumps(bubbles, indent=4))


def main():
    args = parse_args()

    df = pd.read_csv(sys.stdin)
    dct = Dictionary.load(args.dictionary)
    tfidf = TfidfModel.load(args.tfidf)
    stop_words = frozenset() if not (args.stop_words and os.path.exists(args.stop_words)) else frozenset(read_text(args.stop_words))

    # Texts
    left = tokenize_document(df.loc[args.left_idx, 'text'], stop_words)
    right = tokenize_document(df.loc[args.right_idx, 'text'], stop_words)

    # Word Vectors
    bow_left = dct.doc2bow(left)
    bow_right = dct.doc2bow(right)

    tfidf_values_left = tfidf[bow_left]
    tfidf_values_right = tfidf[bow_right]

    # Important words
    important_tokens_left = most_important(tfidf_values_left, args.number_of_tokens)
    important_tokens_right = most_important(tfidf_values_right, args.number_of_tokens)

    token_frequencies_left = get_frequencies(bow_left, frozenset(important_tokens_left.keys()))
    token_frequencies_right = get_frequencies(bow_right, frozenset(important_tokens_right.keys()))
    token_frequencies = set(token_frequencies_left.keys()).intersection(set(token_frequencies_right.keys()))

    # Bubbles
    bubbles = [{'id': idx,
                'name': dct[idx],
                'value': token_frequencies_left.get(idx, 0) + token_frequencies_right.get(idx, 0),
                'left': token_frequencies_left.get(idx, 0),
                'right': token_frequencies_right.get(idx, 0)
                } for idx in token_frequencies]

    write_as_json(bubbles, args.output)


if __name__ == '__main__':
    main()
