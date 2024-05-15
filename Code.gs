const persons = [
    {
        name: "Rahim Mia",
        email: "rahim.mia@xyz.com",
        role: "Manager",
    },
    {
        name: "Zorina Beghum",
        email: "zorina.begum@xyz.com",
        role: "QA",
    },
    {
        name: "Karim Mia",
        email: "karim.mia@xyz.com",
        role: "Developer",
    },
    {
        name: "Jobbar Khan",
        email: "jobbar.khan@xyz.com",
        role: "Developer",
    },
];

function autoUpdateToManager(body) {
    const recipientEmail = persons.find(
        (person) => person.role === "Manager"
    )?.email;
    if (recipientEmail) {
        const subject = `General Update | Bug List Update | Manager | ${new Date()}`;
        sendMail(recipientEmail, subject, body);
    } else {
        console.warning("Manager's email not found.");
    }
}

function unassignedBugNotify() {
    const recipientEmail = persons.find(
        (person) => person.role === "Manager"
    )?.email;
    if (recipientEmail) {
        const subject = `Unassigned Bug | Manager | ${new Date()}`;
        const body = "A new bug has been listed into the Spreadsheet Bug List.";
        sendMail(recipientEmail, subject, body);
    } else {
        console.warning("Manager's email not found.");
    }
}

function notifyQA() {
    const qaEmail = persons.find(
        (person) => person.role === "QA"
    )?.email;
    if (qaEmail) {
        const subject = `Bug Fixed | QA | ${new Date()}`;
        const body = "A bug has been fixed/resolved. Please take a look into it.";
        sendMail(qaEmail, subject, body);
    } else {
        console.warning("QA's email not found.");
    }

}

function notifyDeveloper(name, message) {
    const developerEmail = persons.find(
        (person) => person.name === name
    )?.email;
    if (developerEmail) {
        const subject = `Bug Update | Developer | ${new Date()}`;
        sendMail(developerEmail, subject, message);
    } else {
        console.warning("Developer's email not found.");
    }
}

function sendMail(recipientEmail, subject, body) {
    try {
        GmailApp.sendEmail(recipientEmail, subject, body);
        console.log(`Email send to ${subject}`);
    } catch (error) {
        console.error("Failed to send email:", error);
    }

}

function onEdit(e) {

    console.log(`Author: Mehedi Hasan Shifat (www.github.com/jspw). App Version: 1.0.0`);

    try {
        const sheet = e.source.getActiveSheet();

        const range = e.range;

        const column = range.getColumn();
        const value = range.getValue();

        if (column === 9) { // Column 9 => Column: "Status"
            // autoUpdateToManager("BUG Status has been changed to " + value);
            if (value === "Unassigned") {
                unassignedBugNotify();
            } else if (value === "Fixed") {
                notifyQA();
            } else if (value === "Re Opened") {
                const name = sheet.getRange(range.getRow(), 10).getValue();
                autoUpdateToManager("A bug has been re-opened. Developer: " + name);
                if (!name) {
                    unassignedBugNotify();
                }
                else {
                    notifyDeveloper(name, `One of your task has been re-opened. Please take a look into it.`);
                }
            }
        } else if (column === 10) { // Column 10 => Column "Assignee"
            // autoUpdateToManager("A new bug has been assigned to " + value);
            notifyDeveloper(value, "A new bug has been assigned to you. Please take a look into it.");
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}