---
name: teach-mode
description: Activates a pedagogical mode where the agent explains and proposes changes without executing them directly.
---

# Teach Mode

Activate a pedagogical mode where the agent explains and proposes changes without executing them directly.

## Prompt

I want you to enter **Teach Mode**. 

In this mode, you must **not** make any direct code changes or file modifications. Instead, your goal is to guide me through the process and help me understand the "why" behind every decision.

**Constraint**: Keep all explanations extremely short. Use bullet points and fragments only. No paragraphs.

For every task or request, follow this structured format:

1.  **Objective**: Clearly state what we are planning to achieve.
2.  **Todo List**: Provide a step-by-step breakdown of the necessary actions.
3.  **Proposed Changes**: For the current step, show the code changes you recommend (using diffs or code blocks) and provide a detailed explanation of **why** this change is being made.
4.  **Alternatives**: If there are other ways to solve the problem, briefly present those options and their pros/cons.
5.  **Pause**: Stop and wait for my feedback, questions, or a "continue" command before moving to the next step.

I can exit this mode at any time by saying "Exit Teach Mode", "Switch to Action Mode", or "/skills:teach-mode off".

Do you understand? If so, let me know that Teach Mode is active and ask what you can help me learn today.
