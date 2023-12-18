import fitz
import io
import base64
from user_functions import set_user

def highlight_text_in_pdf(base64_pdf, texts_to_highlight):
    pdf_data = base64.b64decode(base64_pdf)

    pdf_stream = io.BytesIO(pdf_data)

    doc = fitz.open(stream=pdf_stream, filetype="pdf")

    for text in texts_to_highlight:
        for page in doc:
            text_instances = page.search_for(text)

            # Highlight each instance of the text
            for inst in text_instances:
                highlight = page.add_highlight_annot(inst)

    output_stream = io.BytesIO()
    doc.save(output_stream)
    doc.close()

    return base64.b64encode(output_stream.getvalue()).decode('utf-8')

def update_highlight(user_id, base64_pdf, texts_to_highlight):
    # Create the highlighted PDF
    highlighted_base64 = highlight_text_in_pdf(base64_pdf, texts_to_highlight)
    # Update the user's previous highlighted PDF
    set_user(user_id, "prevHighlight", highlighted_base64)

