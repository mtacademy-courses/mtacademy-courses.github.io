"""Runnable Python example for a curriculum visual. Not student work."""
questions = [
    ("What is 2 + 3?", "5"),
    ("Which planet do we live on?", "earth"),
    ("How many sides does a triangle have?", "3"),
]
score = 0
print("Welcome to the curiosity quiz!")
for question, answer in questions:
    response = input(question + " ").strip().lower()
    if response == answer:
        print("Correct! Keep exploring.")
        score += 1
    else:
        print("Keep trying! The answer is", answer)
print("Your score:", score, "/", len(questions))
