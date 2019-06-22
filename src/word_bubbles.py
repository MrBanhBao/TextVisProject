import argparse
from gensim.corpora import Dictionary
from gensim.parsing import preprocessing
import json
import pandas as pd


CUSTOM_FILTERS = [
	lambda x: x.lower(),
	preprocessing.strip_tags,
	preprocessing.strip_punctuation,
	preprocessing.strip_multiple_whitespaces,
	preprocessing.strip_numeric]


def parse_args():
	parser = argparse.ArgumentParser(description='Word bubble creator')
	parser.add_argument('output', nargs='?', default="nodes.json")
	parser.add_argument('--stop_words', required=True)
	parser.add_argument('--manifestos', required=True)
	parser.add_argument('--party_name', required=True)
	parser.add_argument('--year_left', required=True)
	parser.add_argument('--year_right', required=True)
	parser.add_argument('--n_tokens', required=True, type=int)
	
	return parser.parse_args()


def read_manifestos(file_path):
	return pd.read_csv(file_path, index_col=0)


def read_stop_words(file_path):
	with open(file_path, "r") as file:
		for line in file:
			yield line.rstrip()


def tokenize_text(documents, stop_words):
	return documents.apply(lambda doc: [token
		for token in preprocessing.preprocess_string(doc, CUSTOM_FILTERS)
		if token not in stop_words])


def most_common(bag_of_words, n_tokens):
    return {idx: count for idx, count in sorted(bag_of_words, key=lambda x: x[1], reverse=True)[:n_tokens]}


def write_nodes(nodes, output_path):
	with open(output_path, "w") as output_file:
		output_file.write(json.dumps(nodes, indent=4))


def main():
	# Command line arguments
	args = parse_args()

	stop_words = frozenset(read_stop_words(args.stop_words))

	manifestos = read_manifestos(args.manifestos)
	left = manifestos[(manifestos["year"] == args.year_left) & (manifestos["party_name"] == args.party_name)]
	right = manifestos[(manifestos["year"] == args.year_right) & (manifestos["party_name"] == args.party_name)]

	# Indices
	left_idx = left.index[0]
	right_idx = right.index[0]

	# Tokens
	left["tokens"] = tokenize_text(left["text"], stop_words)
	right["tokens"] = tokenize_text(right["text"], stop_words)

	# Corpus & Dictionary
	corpus = left["tokens"].array + right["tokens"].array
	dct = Dictionary(corpus)

	# Bag of Words
	left["bag_of_words"] = left["tokens"].apply(dct.doc2bow)
	right["bag_of_words"] = right["tokens"].apply(dct.doc2bow)

	# Most common words
	left_most_common = most_common(left.loc[left_idx, "bag_of_words"], args.n_tokens)
	right_most_common =  most_common(right.loc[right_idx, "bag_of_words"], args.n_tokens)
	idx_most_common = set(left_most_common.keys()).union(set(right_most_common.keys()))

	# Nodes
	nodes = [{"name": dct[idx],
				"value": left_most_common.get(idx, 0) + right_most_common.get(idx, 0),
				"left": left_most_common.get(idx, 0),
				"right": right_most_common.get(idx, 0)
			} for idx in idx_most_common]

	write_nodes(nodes, args.output)


if __name__ == '__main__':
	main()
