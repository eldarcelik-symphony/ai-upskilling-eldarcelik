# Level [2/3] AI Development Journey - [Your Name]

Start Date: 25. Aug 2025. | Target Completion: 20. Oct 2025.

## Week 1-2: Learning & Practice

### Resources Completed

- [x] [OpenAI Prompting Guide](https://platform.openai.com/docs/guides/prompting) - 1h - Key takeaway: Basics about prompting, prompt caching, prompt engineering, message formatting.
- [x] [Google Gemini Prompting Guide 101 (PDF)](https://services.google.com/fh/files/misc/gemini-for-google-workspace-prompting-guide-101.pdf) - 1h - Key takeaway: Different business activities and examples where AI is used.
- [x] [ChatGPT Prompt Engineering for Developers — DeepLearning.AI](https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/) - 1.5h - Key takeaway: Write clear, structured prompts with examples, allow step-by-step reasoning, and ground answers in relevant information to reduce hallucinations.
- [x] [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) - 1h - Key takeaway: Success criteria that are controllable through prompt engineering.
- [x] [Large Language Models explained briefly by 3Blue1Brown](https://www.youtube.com/watch?v=LPZh9BOjkQs) - 0.2h - Key takeaway: How LLM are developed and how they work, what are parameters in LLMs, what are transformers and feedforward and attention steps
- [x] [Intro to LLMs — Andrej Karpathy (YouTube) by Andrej Karpathy](https://www.youtube.com/watch?v=zjkBMFhNj_g) - 1h - Key takeaway: How LLMs are trained (pretraining, supervised fine-tuning, RLHF), LLM as 'operative system', LLM security.
- [x] [Deep Dive into LLMs like ChatGPT by Andrej Karpathy](https://www.youtube.com/watch?v=7xTGNNLPyMI&list=PLAqhIrjkxbuW9U8-vZ_s_cjKPT_FqRStI&index=3) - 3.5h - Key takeaway: How LLMs are built and trained, their challenges like hallucinations and jagged intelligence so we need to be careful of how to use AI, key methods like RLFH, and major models.
- [x] [How I use LLMs by Andrej Karpathy](https://www.youtube.com/watch?v=EWvNQjAaOHw&list=PLAqhIrjkxbuW9U8-vZ_s_cjKPT_FqRStI&index=4) - 2.5h - Key takeaway: LLM interactions with examples, context window and tokens explanation, training phases with examples, tools used: internet search, deep search, uploads, images, speach, etc.
- [x] [Transformers, the tech behind LLMs by 3Blue1Brown](https://www.youtube.com/watch?v=wjZofJX0v4M&t=183s) - 0.5h - Key takeaway:
- [x] [Attention in transformers, step-by-step by 3Blue1Brown](https://www.youtube.com/watch?v=eMlx5fFNoYc&list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi&index=7) - 0.5h - Key takeaway:
- [x] [How might LLMs store facts by 3Blue1Brown](https://www.youtube.com/watch?v=9-Jl0dxWQs8&t=367s) - 0.5h - Key takeaway:
- [x] [Prompting For AI Agents by Y Combinator](https://www.youtube.com/watch?v=DL82mGde6wo) - 0.5h - Key takeaway: How to think about using AI and different models. Explaining forward deployed engineers approach.
- [x] [RAG vs Fine-Tuning vs Prompt Engineering: Optimizing AI Models by IBM](https://www.youtube.com/watch?v=zYGDpG-pTho) - 0.3h - Key takeaway: RAG retrieves external knowledge to ground model outputs, fine-tuning adapts a model’s weights to a domain or task, and prompt engineering shapes responses by carefully designing the input.
- [x] [System Prompts (GitHub)](https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools) - 0.5h - Key takeaway: Useful examples of Cursor agent prompts, chat prompts, memory prompts.
- [x] [Awesome Cursor rules (GitHub)](https://github.com/PatrickJS/awesome-cursorrules) - 1h. - Key takeaway: Useful examples of Cursor rules for various projects defined by technologies.
- [x] [Cursor working with context](https://docs.cursor.com/en/guides/working-with-context) - 0.5h - Key takeaway: Context is the foundation of effective AI coding, consisting of intent (what you want) and state (what exists).
- [x] [Harper Reed Blog - My LLM codegen workflow atm](https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/) - 0.5h - Key takeaway: Approach to the Greenfield projects (idea, planning, execution) and Non-greenfield projects (get context, iterate) using AI workflows
- [x] [How I reduced 90% errors for my Cursor - video by AI Jason](https://www.youtube.com/watch?v=1L509JK8p1I) - 0.2h - Key takaway: Introduced TaskMaster - AI's personal project manager that can organize, research, expand, prioritize, and ship tasks effortlessly.
- [x] [Best Cursor Workflow - video by AI Jason](https://www.youtube.com/watch?v=2PjmPU07KNs) - 1h - Key takeaway: From PRD to the deployed app using Cursor with the following steps: 1. Project Setup in md files -> 2. Add documentation in settings -> 3. Building the front-end -> 4 Connecting it with APIs -> 5. Building the backend -> 6. Improving the UI -> 7. Deployment
- [x] [Sub-agents - video by AI Jason](https://www.youtube.com/watch?v=LCYBVpSB0Wo) - 0.2h - Key takeaway: Parent agent doesn't know the context of the sub-agent, it only knows the result of sub-agent. Parent agent needs to use `context.md` file to get the full context and after finishing the work it needs to update the file with new info. When passing task to the sub-agent, make sure to pass context file.

### Practice Metrics

| Date          | Task Description                                                                                                                          | Traditional (est) | With AI (actual) | Tool Used | Gain % |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ---------------- | --------- | ------ |
| 27. Aug 2025. | Update React to the latest version (19) and its dependencies, fix breaking changes and make sure the app is built and run without errors. | 4h                | 2h               | Cursor    | 50%    |
| 27. Aug 2025. | Add axios library with basic request and response intercepors and use it instead of 'fetch'.                                              | 4h                | 2h               | Cursor    | 50%    |
| 27. Aug 2025. | Implement automatic snake_case to camelCase conversion via axios response interceptor with tests.                                         | 6h                | 4h               | Cursor    | 37%    |
| 28. Aug 2025. | Refactor Navbar component from a class to the function component and add performance improvements.                                        | 4h                | 1h               | Cursor    | 75%    |
| 28. Aug 2025. | Replace custom CSS with Tailwind inside the whole app                                                                                     | 8h                | 6h               | Cursor    | 25%    |
| 29. Aug 2025. | Get reviews from API and display them at the end of details page with infinite pagination                                                 | 8h                | 4h               | Cursor    | 50%    |

### Weekly Insights

- Week 1:
  - I realized prompting is more of a skill than just writing questions — small changes in clarity, structure, and examples drastically change the quality of answers.
  - Explanation of training made me view LLMs less as “magic black boxes” and more as operating systems with different phases and security layers.
  - Understanding that hallucinations aren’t just “mistakes,” but come from gaps in grounding, made me see why adding structure, step-by-step reasoning is essential.
  - Seeing how LLMs handle tokens, context windows, and external tools gave me a mental model for when the model alone is enough and when I should extend it.
  - The better we learn how something works, the better we will use it.
  - RAG retrieves external knowledge to ground model outputs, fine-tuning adapts a model’s weights to a domain or task, and prompt engineering shapes responses by carefully designing the input.
- Week 2:
  - Rules provide persistent, reusable context at the prompt level. They are included at the start of the model context. This gives the AI consistent guidance for generating code, interpreting edits, or helping with workflows.
  - Agent can directly create memories using tool calls when you explicitly ask it to remember something or when it notices important information that should be preserved for future sessions. We can create `memory.md` file in `.cursor` folder to have persistent memory and use it in the context.
  - Task Master AI is an AI-powered project and task management system designed to automate and streamline complex software development projects by breaking down large prompts into structured, manageable tasks. It can automatically create Project Requirements Documents (PRDs) to generate a detailed task list with priorities and dependencies.

## Week 3-4: Capstone Project

### Project Overview

- **Name:** Book Rental Library
- **Description:** This project is a app with two roles: admin and user. Admins can manage users (approval system), books (add, edit, delete), and borrowed books, all with search and pagination features. Users can browse and borrow books (if approved), view book details, and manage their profile along with their borrowed history, with authentication and authorization implemented for role-based access.
- **Tech Stack:** Next.js, React, Shadcn UI, Tailwind, Resend, Supabase
- **AI Tools Used:** Cursor, Task Master AI

### Productivity Metrics

| Component/Feature                                           | Traditional Estimate | AI-Assisted Actual | Gain % | Notes                                                                          |
| ----------------------------------------------------------- | -------------------- | ------------------ | ------ | ------------------------------------------------------------------------------ |
| Initial project setup (Next.js, Tailwind, Shadcn, Supabase) | 16h                  | 8h                 | 50%    | Used Task Master AI to create task and subtasks, then written code with Cursor |

### New Estimation Capability

Before this program, I would estimate:

- Feature X: [old estimate]
- Task type Y: [old estimate]

Now with AI, I estimate:

- Feature X: [new estimate]
- Task type Y: [new estimate]

## Key Outcomes

### Overall Productivity Gain: [X%]

### Top 3 Game-Changers:

1. [Most impactful learning]
2. [Second key insight]
3. [Third breakthrough]

### How I Work Differently:

[2-3 paragraphs on your transformation]
