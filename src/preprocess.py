import os
import pandas as pd
import string
import re
from tika import parser
from PIL import Image
import pytesseract
from pdf2image import convert_from_path


def clean_text(text, lower=False, remove_numbers=False, remove_punctations=False):
    prep_text = text.replace('\n', ' ')
    prep_text = prep_text.replace('\t', ' ')
    prep_text = re.sub(' +', ' ', prep_text)

    if lower:
        prep_text = prep_text.lower()

    if remove_numbers:
        prep_text = re.sub(r'\d+', '', prep_text)

    if remove_punctations:
        prep_text = prep_text.translate(string.punctuation)

    return prep_text


def get_ocr_text(PDF_file):
    image_counter = 1
    pages = convert_from_path(PDF_file, 500)

    for page in pages:
        filename = "page_" + str(image_counter) + ".jpg"
        page.save(filename, 'JPEG')  # Save the image of the page in system
        image_counter = image_counter + 1

    text_concat = ''
    filelimit = image_counter - 1

    for i in range(1, filelimit + 1):
        filename = "page_" + str(i) + ".jpg"
        # Recognize the text as string in image using pytesserct
        text = str(((pytesseract.image_to_string(Image.open(filename), lang='deu'))))
        text = text.replace('-\n', '')
        text_concat = text_concat + text

    return text_concat


if __name__ == '__main__':
    #
    target_csv = '../Data/aggregated_manifestos.csv'
    bund_csv = '../Data/Results/Bundestagswahlen.csv'
    euro_csv = '../Data/Results/Europawahlen.csv'
    bund_manifestos_dir = '../Data/Manifestos/Bundestagswahlen/'
    euro_manifestos_dir = '../Data/Manifestos/Europawahlen/'
    manigestos_dir = '../Data/Manifestos'

    bund_results_df = pd.read_csv(bund_csv)
    bund_results_df.set_index('Partei', inplace=True)

    euro_results_df = pd.read_csv(euro_csv)
    euro_results_df.set_index('Partei', inplace=True)

    texts = []
    election_types = []
    election_results = []
    party_names = []
    participations = []
    election_years = []

    for (dirpath, dirnames, filenames) in os.walk(manigestos_dir): # TODO: change to Manifesto Root Dir
        for filename in filenames:
            if filename.endswith(('.csv', '.pdf')):
                print(filename)
                election_type = filename[0]
                election_year = filename[1:5]
                party_name = filename.split('_')[1].split('.')[0]

                # Handles election typbes b with csv
                if election_type == 'b':
                    text_df = pd.read_csv(os.path.join(dirpath, filename))
                    text_df = text_df[~text_df.iloc[:, 0].isnull()]

                    if len(text_df) > 1:
                        text = ' '.join(text_df.iloc[:, 0].values)
                    else:
                        text = text_df.iloc[:, 0].values[0]

                    election_result = float(str(bund_results_df.loc[party_name][election_year]).replace(',', '.'))
                    participation = float(str(bund_results_df.loc['Wahlbeteiligung'][election_year]).replace(',', '.'))

                # Handles election types e with pdfs
                if election_type == 'e':
                    pdf = parser.from_file(filename=os.path.join(dirpath, filename))
                    pdf_sites = int(pdf['metadata']['xmpTPg:NPages'])

                    if pdf['content'] is not None: # check if doc was ocr scanned
                        text = clean_text(pdf['content'])

                        if len(text) <= pdf_sites * 200:  # Threshhold to check if doc was ocr scanned
                            text = clean_text(get_ocr_text(os.path.join(dirpath, filename)))
                    else:
                        text = clean_text(get_ocr_text(os.path.join(dirpath, filename)))
                    election_result = float(str(euro_results_df.loc[party_name][election_year]).replace(',', '.'))
                    participation = float(str(euro_results_df.loc['Wahlbeteiligung'][election_year]).replace(',', '.'))

                texts.append(text)
                election_types.append(election_type)
                election_results.append(election_result)
                party_names.append(party_name)
                participations.append(participation)
                election_years.append(election_year)

    df = pd.DataFrame({
        'year': election_years,
        'participation': participations,
        'party_name': party_names,
        'result': election_results,
        'text': texts,
        'type': election_types
    })

    df = df.sort_values(by=['type', 'year', 'party_name']).reset_index(drop=True)
    df.to_csv(target_csv)
    print(df.head())




