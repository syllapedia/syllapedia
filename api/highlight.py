import fitz
import io
import base64
import re

def preprocess_texts(texts):
    # Defines delimiters
    delimiters = [
        '\t', '\u00A0', '\u200B',  # Whitespace Characters
        '\n', '\r', '\u2028', '\u2029', '\f', '\\\\',  # Line Breaks and Escape Char
        '—', '–', '…',  # Unicode Characters
        '•', '-'  # List and Dash
    ]
    # Escaping delimiters that are special characters in regex (e.g., '\')
    escaped_delimiters = [re.escape(delimiter) for delimiter in delimiters]
    # Adding the regex pattern for numerical list indicators
    regex_pattern = '|'.join(escaped_delimiters + [r'\d+\.\s'])

    processed_texts = []
    for text in texts:
        # Splitting the text by the regex pattern
        pieces = re.split(regex_pattern, text)
        processed_texts.extend(pieces)
    
    # Filter out empty strings and strip whitespace from each piece
    return [piece.strip() for piece in processed_texts if piece.strip() and len(piece.strip()) >= 3]

def highlight_text_in_pdf(base64_pdf, texts_to_highlight):
    page_number = -1

    # Converts blob into pdf
    pdf_data = base64.b64decode(base64_pdf)
    pdf_stream = io.BytesIO(pdf_data)

    # Opens pdf with fitz
    doc = fitz.open(stream=pdf_stream, filetype="pdf")

    # Preprocess texts to highlight to handle newlines, page breaks, and bullets
    processed_texts = preprocess_texts(texts_to_highlight)

    # Highlights text in pdf
    for text in processed_texts:
        for page in doc:
            text_instances = page.search_for(text)

            # Highlight each instance of the text
            for inst in text_instances:
                if page_number == -1:
                    page_number = page.number + 1
                highlight = page.add_highlight_annot(inst)

    output_stream = io.BytesIO()
    doc.save(output_stream)
    doc.close()

    # Returns pdf converted into a blob
    return {"base64": base64.b64encode(output_stream.getvalue()).decode('utf-8'), "pageNumber":page_number}

