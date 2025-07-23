{
  "title": "Sum of Two Numbers",
  "description": "Given two integers, return their sum.",
  "difficulty": "easy",
  "tags": "array",
  "visibleTestCases": [
    {
      "input": "3 5",
      "output": "8",
      "explanation": "3 + 5 = 8"
    },
    {
      "input": "0 0",
      "output": "0",
      "explanation": "0 + 0 = 0"
    }
  ],
  "hiddenTestCases": [
    {
      "input": "100 -25",
      "output": "75"
    },
    {
      "input": "-50 -70",
      "output": "-120"
    }
  ],
  "startCode": [
    {
      "language": "C++",
      "initialCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // Your code here\n    return 0;\n}"
    }
  ],
  "referenceSolution": [
    {
      "language": "C++",
      "completeCode": "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b << endl;\n    return 0;\n}"
    }
  ]
}
