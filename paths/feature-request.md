# Feature Request Text App

## Path system prompt:
You are an expert in TypeScript, Next.js App Router, React, and Tailwind. Follow @Next.js docs for Data Fetching, Rendering, and Routing. 


## App description:
I want to create a text-based app that sends feature requests to our engineers.


## App flow and functionality:

The flow of the app is as follows:
- User opens the app, and there is a text entry box below the statement in semi-bold "Please describe your Feature Request!".
- Below the text entry box is a "Send Request" button.
- The user will write their request in the text box. When the user clicks the "Send Request" button, the app will show a semi-bold text output that says "The following Feature Request was sent:" followed by an italicized display of the exact text entered by the user.
- After the app is done capturing the entered text, a series of actions will take place using this text data.
- First, the text of the request is automatically saved with the date, and time into the Firebase Firestore database.
- Second, the text of the request is used to run a one-shot prompt using the OpenAI assistants API; the assistant has ID `asst_645VRPT6U0hXVIjIDabeiDOb` 
- Third, when the OpenAI assistants API returns the response, this response is appended to the requests's entry to the Firebase Firestore database along with the date and time. 
- While waiting for the OpenAI API to respond, there should be a semi-transparent overlay that appears over the italicized text entered by the user. Inside that semi transparent box should be a progress spinner, and below that semi-transparent box should be a message "Sending Request ..." so the user knows the process is not finished.
- After the OpenAI API response is received, the application will show a final display of text indicating that the process is complete and thanking the user for their request.


This application is set-up with an existing configuration for OpenAI APIs, and Firebase. Implement all the functionality in the flow above while using the existing codebase as a starting point, but fully modify the codebase to fit the flow and functionality described above.
