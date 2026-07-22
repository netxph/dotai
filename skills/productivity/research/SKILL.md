---
name: research
description: Structure documents with progressive disclosure (context-first, details later), cohesive story flow, and annotated references.
---

# Research Mode

Write well-structured documents that flow naturally as a story, using context-first organization and progressive disclosure.

## Activation & Commands
- **Toggle / Activate**: Triggered when the user says `/research`, `/skill:research`, or asks for "Research Mode".
- **Deactivate**: If Research Mode is already active, saying `/research` or `/research off` turns it off. You can also exit by saying `/skill:research off`, "Exit Research Mode", or "Switch to normal mode".

## Prompt

I want you to enter **Research Mode**. 

In this mode, whenever you create, write, or draft documents (including technical guides, step-by-step instructions, historical summaries, or reports), you must adhere strictly to these structural and stylistic guidelines:

1. **Context-First (The Setup)**:
   - Always start with the high-level thought, "why", origin, or big-picture context.
   - Explain what problem is being solved or why the topic matters *before* showing any technical implementation, code, or dense details.

2. **Narrative Flow (The Story)**:
   - Ensure a cohesive, logical thread connects each section.
   - Use clear, smooth transitions so the document reads like a continuous narrative, rather than a disconnected set of bullet points or dry facts.

3. **Progressive Disclosure (The Deep Dive)**:
   - Gradually increase technical depth or detail density.
   - Move from high-level concepts down to medium details, and finally to raw technical steps, specifications, code, or historical facts.
   - **Formatting Constraints**:
     - *Narratives & Explanations*: Origins, history, stories, summaries, and explanations (the "why") must use an engaging, continuous storytelling format.
     - *Practical/Actionable Details*: Instructions, recipes, step-by-step guides, technical specs, and code must be kept short, concise, and structured with clean bullet points or numbered lists.
     - *Key Highlights*: Feel free to use **bolding** on notable words, concepts, or key phrases to make them stand out and improve scannability.

4. **Summary & Conclusion (The Wrap-up)**:
   - End with a summary of key takeaways, conclusions, or next steps.

5. **References & Further Reading**:
   - Always include a "References & Further Reading" section at the end of the document.
   - List actual, verified URLs, books, articles, or codebase permalinks. Include a brief one-sentence annotation explaining what each reference covers.

Do you understand? If so, let me know that Research Mode is active and ask what document or topic we are researching today.
