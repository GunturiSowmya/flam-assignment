# FLAM Study Assistant

A small React study tool that turns a topic or pasted notes into flashcards and a multiple-choice quiz. It renders structured study material as interactive UI rather than a chat transcript.

## Features

- Free-form topic and notes input
- AI-generated flashcards with flip and previous/next controls
- Five-question quiz with answer feedback, score, and a retest round for missed questions
- Loading, friendly error, retry, and introductory empty states
- JSON parsing and structural validation before rendering
- Request ID guard against stale responses
- Backend timeout for slow OpenRouter requests

## Tech stack

- React 19, Vite, and CSS
- Express 5 backend
- OpenRouter Chat Completions API
- Node.js 20 or later

## Setup

Install dependencies in each app folder:

```sh
cd server
npm install
```

In a second terminal, from the project root:

```sh
cd client
npm install
```

Create the backend environment file by copying `server/.env.example` to `server/.env`, then set `OPENROUTER_API_KEY` to your own key. Keep the key in the server folder; do not put it in a client environment variable or commit `.env`.

Start the backend from the `server` folder:

```sh
npm start
```

Start the frontend from the `client` folder in the other terminal:

```sh
npm run dev
```

Open the local URL printed by Vite. Its `/api` development proxy forwards requests to the Express server on port 5000.

## Usage

Enter a topic or paste study notes, then choose **Generate**. Flip flashcards to reveal their answers, navigate the deck, answer each quiz question, and retest any questions missed at the end.

## How it works

1. `PromptInput` collects free-form text and calls the handler in `App`.
2. `client/src/lib/api.js` posts the prompt to `/api/response`.
3. The Vite proxy sends that request to Express. `server/server.js` adds the server-only OpenRouter key and asks the model for JSON matching the study schema.
4. The backend returns `{ success, data }`. `parseResult.js` parses normal JSON, fenced JSON, or a JSON object surrounded by text. `validateResult.js` checks the title, cards, quiz, four options per question, and answer index before `ResultView` receives the data.
5. React state controls card flipping/navigation and quiz selection, feedback, scoring, and missed-question retests. An incrementing request ID prevents an older response from updating the current result.

The OpenRouter key stays in `server/.env` and is never sent to the browser. Server and upstream failures return safe messages without exposing the key or stack trace. An OpenRouter request is stopped after 45 seconds; malformed or incomplete model output is routed to the frontend error state, where the user can retry.

## AI assistance

ChatGPT assisted with completing the loading, error, and quiz-question components; connecting the parser to the API helper; implementing a retest round; adding a backend timeout; reviewing environment-key handling; and checking the code with local mocked API/parser cases, build, and lint. Live OpenRouter prompts and browser interaction/viewport tests have not been run in this review.

## Known limitations and verification

- OpenRouter availability and model output quality can vary. The backend prompt requests five cards and five quiz questions; structural validation enforces non-empty arrays and four options per question but does not enforce an exact item count.
- Quiz progress and generated material are held in memory and are lost on refresh.
- The responsive CSS is present, but viewport sizes have not been tested in a browser as part of this review.
- No live request, screen recording, or deployment is included.

## Time spent

The total time spent on the original project was not recorded in the repository. Record your actual total here before submission; do not use this review time as a substitute.

## Checks

From `client/`, run `npm run build` and `npm run lint`. The parser, validator, and API error paths can be exercised locally with mocked fetch responses; live model and browser tests require a configured key and a browser session.
