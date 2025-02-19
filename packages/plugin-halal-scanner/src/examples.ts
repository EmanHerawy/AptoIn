import { ActionExample } from "@elizaos/core";

export const getHalalScannerExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "Is this token halal or not?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Let me assess the token for halal compliance.",
                action: "HALAL_TOKEN_ASSESSMENT",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "What is the risk assessment of this token?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Let me evaluate the risk associated with this token and scan it for halal compliance.",
                action: "HALAL_TOKEN_ASSESSMENT",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Can you check if this token is halal?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I will assess the token for halal compliance.",
                action: "HALAL_TOKEN_ASSESSMENT",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "What is the halal status of this token?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I will scan the token for halal compliance.",
                action: "HALAL_TOKEN_ASSESSMENT",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Is this token compliant with halal standards?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I will assess the token for halal compliance.",
                action: "HALAL_TOKEN_ASSESSMENT",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Can you verify if this token is halal?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I will scan the token for halal compliance.",
                action: "HALAL_TOKEN_ASSESSMENT",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "What is the halal certification status of this token?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I will check the halal certification of the token.",
                action: "HALAL_TOKEN_ASSESSMENT",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Is this token compliant with Shariah principles?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I will assess the token for Shariah compliance.",
                action: "SHARIAH_TOKEN_ASSESSMENT",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Can you verify if this token is Shariah-compliant?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I will scan the token for Shariah compliance.",
                action: "SHARIAH_TOKEN_ASSESSMENT",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "What is the Shariah certification status of this token?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I will check the Shariah certification of the token.",
                action: "SHARIAH_TOKEN_ASSESSMENT",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Is this token in line with Islamic principles?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I will evaluate the token for Islamic compliance.",
                action: "ISLAMIC_TOKEN_ASSESSMENT",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Can you confirm if this token adheres to Islamic standards?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I will verify the token for Islamic compliance.",
                action: "ISLAMIC_TOKEN_ASSESSMENT",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "What is the Islamic certification status of this token?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I will check the Islamic certification of the token.",
                action: "ISLAMIC_TOKEN_ASSESSMENT",
            },
        }
    ],
]

