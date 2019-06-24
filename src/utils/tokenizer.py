from gensim.parsing import preprocessing

CUSTOM_FILTERS = [
    lambda x: x.lower(),
    preprocessing.strip_tags,
    preprocessing.strip_punctuation,
    preprocessing.strip_multiple_whitespaces,
    preprocessing.strip_numeric,
    preprocessing.split_alphanum]


def tokenize_document(document, stop_words, stem_text=False):
    text_filters = CUSTOM_FILTERS + [preprocessing.stem_text] if stem_text else CUSTOM_FILTERS
    return [token for token in preprocessing.preprocess_string(document, text_filters) if token not in stop_words]
