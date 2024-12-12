# app.py
from flask import Flask, request, jsonify
import sympy as sp

app = Flask(__name__)

@app.route('/compare', methods=['POST'])
def compare_formulas():
    data = request.json
    formula1 = sp.sympify(data.get('formula1', ''))
    formula2 = sp.sympify(data.get('formula2', ''))
    
    are_equal = formula1.equals(formula2)
    return jsonify({
        "formula1": str(formula1),
        "formula2": str(formula2),
        "are_equal": are_equal
    })

if __name__ == '__main__':
    app.run(debug=True)
