# Abby
- Used AI: ChatGPT
- Outcome: A summary of the key points on the things people liked and suggestions and improvements for our team.
- how useful this tool was / potentially could be for your coding effort going forward
    - ChatGPT does a good job in summarizing great amount of material into one. It reduces the repetitiveness of the content that a human would need to read on their own. Moving forawrd, ChatGPT would be useful if we are to create a summary of our ideas. For example, if we want to do a user story, we could let each of our members write one and let ChatGPT summarize and combine all for us.
- what steps you needed to (or couldn’t) take to ensure that the AI output was correct, understandable, and fair use
    - To make sure that the output was correct, we would have to read all the content in the file I plugged in, which loses the point of letting the AI summarize it. Therefore, it would be more beneficial to read through the response and look for sketchy to simply disregard since this summary should be in content that we are all familiar with.

# Giovanni
- Used AI: ChatGPT
- Usecase: Touching up/improving the UI using suggestions given by, also used to fix some minor visual issues with the UI
- Outcome: After some initial issues just giving instructions to just "fix it", I ended up having it offer some potential solutions, and it was only actually useful for quickly locating what I needed to change. Adding elements such as a switch, however, proved to be much more effective. 
- Usefulness: Useful for brainstorming, adding fresh features, but infeffective at fixing large issues in one shot. Useful for general information and providing a list of possible options. 
- Steps taken to ensure correctness: Gave the model a structured input where the overview, problem, and acceptable solution was clearly outlined, as well as clearly defined files. Tested code to ensure it ran correctly and achieved what was intended. 


# Yungong
- Used AI: ChatGPT
- Outcome: Some suggestion about which test-lib should we use, some common testing functions and the way to use them, and how to install the config and dependencies for the test-lib.
- how useful this tool was / potentially could be for your coding effort going forward
    - ChatGPT really provides me with many information and materials about coding. For example, if I need to complete a certain task that may use certain function, but I do not know which lib or repo should I import, it can provide me with some really good choice. In addition, though we can go to read the documentation for the function and lib, ChatGPT can give a really quick and easy summary for you, which is easier for us to understand. This can help you familiarize coding faster when you first learn a new language or framework.
- what steps you needed to (or couldn’t) take to ensure that the AI output was correct, understandable, and fair use
    - The best way to make sure whether the AI output is correct is actually following the step it generated. However, this does not means that we should just copy and paste the code that ChatGPT writes for us. I think we should first try to understand the function and format that ChatGPT provides with us, and think about it if they are reasonable, and then try to use them on our local host for our own word and modification for our purpose. It is better and important to use the AI output cautiously.

# Nathan
- Used AI: ChatGPT
- Usecase: Prototyping new additions in the form of dropdown menus with UCSB Gold class information. This class information is extracted using new APIs that are publicly available.
- Outcome: A very simple program that demonstrates how extracting class information and putting it into a dropdown menu would work. Helpful (at least to me) for seeing how requesting information using an API works. Nothing actually added onto the project itself, I made everything in a separate test app.
- Usefulness: Very useful for someone like me who doesn't really know where to start with something like this. ChatGPT was able to easily set up a working dropdown menu that, after a bit of fixing on my part with the API key, displayed a full list of all the classes available at UCSB limited by the page size specified in the API request. I've been experimenting with customizing the API request to narrow down the class list, but regardless, it has been a very helpful foundation to go off of. It didn't do much for the aesthetics of the app (I didn't tell it to make it look better) but that's obviously something we would do ourselves.
- Steps taken to ensure correctness: I provided ChatGPT with the source file for the test app I was using to ensure that the result would be easy to integrate back into the app itself. I also made my requests simple yet detailed enough to provide useful results. 

# Christian
- Used AI: ChatGPT
- Outcome: A rudimentary React program that calls on UCSB API.
- How useful this tool was / potentially could be for your coding effort going forward:
    - ChatGPT does a tremendous job creating a framework of some function that would otherwise be tedious to implement alone, especially without prior experience. It also explains step-by-step what it's doing so I'm not merely copying code, but understanding it for future use.
- What steps you needed to (or couldn’t) take to ensure that the AI output was correct, understandable, and fair use:
    - Obviously, I had to run the program to ensure it properly called the API. However, the functionality wasn't quite what I was looking for which is totally okay. Now that I verified what output is doing, I can now make my adjustments so it fits my team's needs.

# Bharat
- Used AI: Claude
- Usecase: Figuring out proper ics format for calendar files and how to structure the code
- Outcome: A button that, when pressed, creates a ics file of your calendar
- How useful this tool was / potentially could be for your coding effort going forward:
    - Claude helped alot on showing me what was necessary. It gave me useful insights on the nature of the ICS format and how specific it could be. It also helped in creating certain Regex formulas which I otherwise would've spent a while trying to create by myself.
- What steps you needed to (or couldn't) take to ensure that the AI output was correct, understandable, and fair use:
    - Testing it out was the main method of ensuring it was correct. In fact, it wasn't correct the first time. I had to go into the code and rewrite certain portions to fit my specific use case. There were small hiccups here and there were the output was not strict enough with the ics standard. Even now, there is a potential bug where every event is duplicated. I will be taking a stab at that for my next task.