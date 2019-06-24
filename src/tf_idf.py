import argparse
import os.path
import sys

from gensim.corpora import Dictionary
from gensim.models import TfidfModel
import pandas as pd

from utils.tokenizer import tokenize_document


def parse_args():
	parser = argparse.ArgumentParser(description='Bag of words creator')
	parser.add_argument('name', nargs='?', default="")
	parser.add_argument('-s', '--stop_words', dest='stop_words')
	return parser.parse_args()


def read_stop_words(file_path):
	with open(file_path, "r") as file:
		for line in file:
			yield line.rstrip()


def main():
	args = parse_args()

	df = pd.read_csv(sys.stdin)
	stop_words = frozenset() if not (args.stop_words and os.path.exists(args.stop_words)) else frozenset(read_stop_words(args.stop_words))

	# Texts
	corpus = [tokenize_document(document, stop_words) for _, document in df['text'].iteritems()]

	# Training the models
	print('Training the models')
	dct = Dictionary(corpus)
	model = TfidfModel([dct.doc2bow(document) for document in corpus])

	# Saving the models
	print('Saving the models')
	dct.save(args.name + "_dictionary.model")
	model.save(args.name + '_tfidf.model')


if __name__ == '__main__':
	main()
