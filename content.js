console.log("Content script loaded");

let observer;
let currentComposeWindow = null;

function initializeObserver() {
    if (observer) {
        observer.disconnect();
    }

    observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            const addedNodes = Array.from(mutation.addedNodes);
            const hasComposeWindow = addedNodes.some((node) =>
                node.nodeType === Node.ELEMENT_NODE &&
                (node.matches?.('.aDh, .btC, [role="dialog"]') || 
                 node.querySelector?.('.aDh, .btC, [role="dialog"]'))
            );

            if (hasComposeWindow) {
                console.log("Compose element detected!");
                setTimeout(() => {
                    checkAndAddButton();
                }, 1000);
                break;
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function checkAndAddButton() {
    const toolbar = findToolbar();
    if (!toolbar) {
        console.log("Toolbar not found, retrying...");
        setTimeout(checkAndAddButton, 500);
        return;
    }

    const existingButton = toolbar.querySelector("#ai-reply-button");
    if (existingButton) {
        return;
    }

    console.log("Toolbar found, adding button");
    const button = createButton();
    toolbar.insertBefore(button, toolbar.firstChild);
    currentComposeWindow = toolbar.closest('.aDh, .btC, [role="dialog"]');
}

function createButton() {
    const button = document.createElement("button");
    button.id = "ai-reply-button";
    button.className = "T-I J-J5-Ji aoO T-I-atl L3";
    button.setAttribute("role", "button");
    button.setAttribute("data-tooltip", "Generate AI Reply");
    button.innerText = "AI Reply";
    button.style.marginRight = "8px";
    button.style.cursor = "pointer";

    button.addEventListener("click", handleButtonClick);
    return button;
}

async function handleButtonClick(event) {
    const button = event.target;
    console.log("AI Reply button clicked");

    button.disabled = true;
    button.innerText = "Generating...";

    try {
        const emailContents = extractEmailContent();
        console.log("Extracted email content:", emailContents);
        
        if (!emailContents || emailContents.length < 5) {
            throw new Error("No sufficient email content found");
        }

        console.log("Sending request to backend...");
        
        const response = await fetch("https://email-replier-backend.onrender.com/email/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                content: emailContents,
                tone: "professional",
            }),
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Server error:", errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.text();
        console.log("Received response data:", responseData);

        const success = insertTextIntoComposeBox(responseData);
        if (!success) {
            throw new Error("Failed to insert text into compose box");
        }

        console.log("AI reply generated successfully!");

    } catch (error) {
        console.error("Error generating AI reply:", error);
        button.innerText = "Error - Click to retry";
        button.disabled = false;
        return;
    }

    button.disabled = false;
    button.innerText = "AI Reply";
}

function extractEmailContent() {

    const quotedText = document.querySelector('.gmail_quote');
    if (quotedText) {
        console.log("Found quoted text");
        return quotedText.textContent.trim();
    }
    
    const emailContent = document.querySelector('.ii.gt') || document.querySelector('.a3s.aiL');
    if (emailContent) {
        console.log("Found email content");
        return emailContent.textContent.trim();
    }
    
    const emailThread = document.querySelector('[role="main"]');
    if (emailThread) {
        console.log("Found email thread");
        const text = emailThread.textContent.trim();
        if (text.length > 50) return text;
    }
    
    const allTextElements = document.querySelectorAll('div, p, span');
    let longestText = '';
    
    allTextElements.forEach(el => {
        const text = el.textContent.trim();
        if (text.length > longestText.length && text.length < 5000) {
            longestText = text;
        }
    });
    
    if (longestText.length > 50) {
        console.log("Found longest text on page");
        return longestText;
    }
    
    console.log("No email content found, using fallback");
    return "Please provide context for the AI to generate a reply.";
}

function insertTextIntoComposeBox(text) {
    console.log("Looking for compose box...");
    
    const selectors = [
        '[role="textbox"][g_editable="true"]',
        '[aria-label="Message Body"]',
        '.Am.Al.editable.LW-avf',
        '.editable',
        'div[contenteditable="true"]'
    ];
    
    let composeBox = null;
    for (const selector of selectors) {
        composeBox = document.querySelector(selector);
        if (composeBox) {
            console.log("Found compose box with selector:", selector);
            break;
        }
    }
    
    if (!composeBox) {
        console.error("Compose box not found with any selector");
        return false;
    }
    
    try {
        composeBox.focus();
        
        composeBox.innerHTML = '';
        
        composeBox.textContent = text;
        
        const events = ['input', 'change', 'keydown', 'keyup', 'keypress'];
        events.forEach(eventType => {
            composeBox.dispatchEvent(new Event(eventType, { bubbles: true }));
        });
        
        console.log("Text inserted successfully");
        return true;
        
    } catch (error) {
        console.error("Error inserting text:", error);
        return false;
    }
}

function findToolbar() {
    const selectors = [
        '.aDh',
        '.btC',
        '[role="toolbar"]',
        '.gU.Up',
        '.aoD.hl'
    ];
    
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
    }
    
    return null;
}

function observeVisibilityChanges() {
    const visibilityObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'style') {
                const target = mutation.target;
                if (target.matches?.('.aDh, .btC, [role="dialog"]') && 
                    target.style.display !== 'none' &&
                    target.style.visibility !== 'hidden') {
                    console.log("Compose window became visible");
                    setTimeout(() => {
                        checkAndAddButton();
                    }, 500);
                }
            }
        });
    });

    const composeWindows = document.querySelectorAll('.aDh, .btC, [role="dialog"]');
    composeWindows.forEach(window => {
        visibilityObserver.observe(window, {
            attributes: true,
            attributeFilter: ['style']
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeObserver();
        setTimeout(() => {
            checkAndAddButton();
            observeVisibilityChanges();
        }, 2000);
    });
} else {
    initializeObserver();
    setTimeout(() => {
        checkAndAddButton();
        observeVisibilityChanges();
    }, 2000);
}

document.addEventListener('focus', () => {
    setTimeout(() => {
        checkAndAddButton();
    }, 500);
}, true);