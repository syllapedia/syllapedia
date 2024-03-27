import fitz
from fuzzywuzzy import process
import io
import base64
import re

def process_text(text, delimiters):
    # Escapes delimiters that are special characters in regex
    escaped_delimiters = [re.escape(delimiter) for delimiter in delimiters]
    # Adds the regex pattern
    regex_pattern = '|'.join(escaped_delimiters)

    # Splits the text by the regex pattern
    pieces = re.split(regex_pattern, text)
    
    # Filters out empty strings and strips whitespace from each piece
    processed_pieces = [piece.strip() for piece in pieces if piece.strip() and len(piece.strip()) >= 3]

    return processed_pieces

def find_text_in_context(text, context):
    # Separates text by whitespace into a list of character chunks
    processed_text = process_text(text, [' ', '\t', '\u00A0', '\u200B', '\n', '\r', '\u2028', '\u2029', '\f', '\\\\'])

    # Handles if there is no text to find when processed
    if not processed_text:
        return text
    
    # Finds every substring that matches the start and stop of the processed text
    start, stop = processed_text[0], processed_text[-1]
    substrings = []
    start_positions = []

    for i in range(len(context)):
        if context[i:i + len(start)] == start:
            start_positions.append(i)
        if context[i:i + len(stop)] == stop:
            for start_pos in start_positions:
                if i + len(stop) > start_pos:
                    substrings.append(context[start_pos:i + len(stop)])
    
    # Handles if there are no substrings found
    if not substrings:
        return text

    # Matches the closest substring, depending on a threshold, to the original text
    found_text_score = process.extractOne(text, substrings)
    return found_text_score[0] if found_text_score and found_text_score[1] > 80 else text

def highlight_text_in_pdf(base64_pdf, context, texts_to_highlight):
    # Converts blob into pdf
    pdf_data = base64.b64decode(base64_pdf)
    pdf_stream = io.BytesIO(pdf_data)

    # Opens pdf with fitz
    doc = fitz.open(stream=pdf_stream, filetype="pdf")

    # Highlights text in pdf
    page_numbers = set()

    # Finds the text in the context and handle line breaks
    processed_texts = []
    for text in texts_to_highlight:
        text_in_context = find_text_in_context(text, context)
        processed_texts += process_text(text_in_context, ['\n', '\r', '\u2028', '\u2029', '\f', '\\\\'])

    for text in processed_texts:        
        for page in doc:
            # Searches for every instance of processed text in a page
            text_instances = page.search_for(text)

            # Highlights each instance of the text
            for inst in text_instances:
                page_numbers.add(page.number + 1)
                highlight = page.add_highlight_annot(inst)

    # Sets page number to earliest highlight if there is a highlight
    page_number = min(page_numbers) if len(page_numbers) else -1

    output_stream = io.BytesIO()
    doc.save(output_stream)
    doc.close()

    # Returns pdf converted into a blob
    return {"base64": base64.b64encode(output_stream.getvalue()).decode('utf-8'), "pageNumber": page_number}

