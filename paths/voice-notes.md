# Feature Request Voice or Text App

## Path system prompt:
You are an expert in TypeScript, Next.js App Router, React, and Tailwind. Follow @Next.js docs for Data Fetching, Rendering, and Routing. 


## App description:
I want to create a voice-based or text-based app that records and sends feature requests to our engineers.


## App flow and functionality:

The flow of the app is as follows:
- User opens the app, and there is a radio button below the question "How would you like to enter your Feature Request?" with two options "Audio Recording" and "Text Entry" with the selection defaulted to "Audio Recording".
- When "Audio Recording" is selected, below the radio button is a play/start button to start recording your voice. If the user selects "Text Entry", the play/start button should be replaced with a text entry box and a "Send Request" button.
- When "Audio Recording" is selected and the user clicks on the play/start button, it asks for permission to access the microphone. If the user clicks allow, the app starts recording and the button changes to a stop button. As the user speaks, the app transcribes the voice recording in real-time using the Deepgram real-time voice API. While the user is speaking, there is a clean, simple animation on the screen along with the realtime transcription of the voice request. The user will click the stop button to finish the recording. After the recording stops, the app will show a text output of the transcribed voice request that says "The following Feature Request was sent:" followed by an italicized display of the exact text entered by the user.
- When "Text Entry" is selected, the user will write their request in the text box. When the user clicks the "Send Request" button, the app will show a text output that says "The following Feature Request was sent:" followed by an italicized display of the exact text entered by the user.
- After the app is done transcribing the recording into text or capturing the entered text, a series of actions will take place using this text data.
- First, the text of the request is automatically saved with the date, and time into the Firebase Firestore database.
- Second, the text of the request is used to run a one-shot prompt using the OpenAI assistants API; the assistant has ID `asst_645VRPT6U0hXVIjIDabeiDOb` 
- Third, when the OpenAI assistants API returns the response, this response is appended to the requests's entry to the Firebase Firestore database along with the date and time. 
- While waiting for the OpenAI API to respond, there should be a message "Sending Request ..." along with a spinning wheel so the user knows the process is not finished.
- After the API response is received, the application will show an overlay bubble that says "Thank you for your request!"


This application is set-up with an existing configuration for OpenAI APIs, Deepgram APIs, and Firebase. Implement all the functionality in the flow above while using the existing codebase as a starting point, but fully modify the codebase to fit the flow and functionality described above.
