import React from 'react';
import { showToast } from './ToastCard';

const StatusCodeHandler = ({ error }) => {
    console.log("error",error);
    const getErrorMessage = (error) => {
        switch (error) {
            case 100:
                return "Continue: Server received headers, proceed to send body";
            case 101:
                return "Switching Protocols: Requester asked server to switch protocols";
            case 102:
                return "Processing: Server is processing the request, no response yet";
            case 103:
                return "Early Hints: Return some response headers before final HTTP message";
            case 200:
                return "OK: Request succeeded";
            case 201:
                return "Created: New resource created";
            case 202:
                return "Accepted: Request accepted for processing";
            case 203:
                return "Non-Authoritative Info: Successful request, info from another source";
            case 204:
                return "No Content: Request processed successfully, no content returned";
            case 205:
                return "Reset Content: Request processed, client should reset view";
            case 206:
                return "Partial Content: Server delivering part of resource";
            case 207:
                return "Multi-Status: XML message with multiple response codes";
            case 208:
                return "Already Reported: DAV binding members already enumerated";
            case 300:
                return "Multiple Choices: Multiple options for the resource";
            case 301:
                return "Moved Permanently: Resource permanently moved to a different URL";
            case 302:
                return "Found: Resource temporarily located at a different URL";
            case 303:
                return "See Other: Redirect to another resource";
            case 304:
                return "Not Modified: Resource not modified since last requested";
            case 305:
                return "Use Proxy: Proxy must be used to access the resource";
            case 306:
                return "Unused: Reserved, no longer used";
            case 307:
                return "Temporary Redirect: Temporary redirect to another URL";
            case 308:
                return "Permanent Redirect: Permanent redirect to another URL";
            case 400:
                return "Please Correct Errors below!";
            case 401:
                return "Unauthorized: Authentication required";
            case 402:
                return "Payment Required: Reserved";
            case 403:
                return "You don't have permission to perform this action.";
            case 404:
                return "Not Found: Resource not found";
            case 405:
                return "Method Not Allowed: Unsupported method";
            case 406:
                return "Not Acceptable: Content not acceptable";
            case 407:
                return "Proxy Auth Required: Proxy authentication needed";
            case 408:
                return "Request Timeout: Server timed out";
            case 409:
                return "Conflict: Linked with other Resources!";
            case 410:
                return "Gone: Resource removed";
            case 411:
                return "Length Required: Content length required";
            case 412:
                return "Precondition Failed: Request condition not met";
            case 413:
                return "Payload Too Large: Request payload too big";
            case 414:
                return "URI Too Long: Request URI too long";
            case 415:
                return "Unsupported Media Type: Unsupported media format";
            case 416:
                return "Range Not Satisfiable: Range not satisfiable";
            case 417:
                return "Expectation Failed: Expectation not met";
            case 418:
                return "I'm a teapot: Humorous error";
            case 421:
                return "Misdirected Request: Server unable to respond";
            case 422:
                return "Unprocessable Entity: Request unprocessable";
            case 423:
                return "Locked: Resource locked";
            case 424:
                return "Failed Dependency: Request failed dependency";
            case 425:
                return "Too Early: Request too early";
            case 426:
                return "Upgrade Required: Upgrade required";
            case 428:
                return "Precondition Required: Precondition required";
            case 429:
                return "Too Many Requests: Rate limit exceeded";
            case 431:
                return "Request Header Too Large: Header too large";
            case 451:
                return "Unavailable For Legal Reasons: Legal restriction";
            case 499:
                return "Client Closed Request: Client closed connection";
            case 500:
                return "Internal Server Error: Server error";
            case 501:
                return "Not Implemented: Feature not implemented";
            case 502:
                return "Bad Gateway: Invalid response from upstream server";
            case 503:
                return "Service Unavailable: Service temporarily unavailable";
            case 504:
                return "Gateway Timeout: Upstream server timeout";
            case 505:
                return "HTTP Version Not Supported: HTTP version not supported";
            case 506:
                return "Variant Also Negotiates: Variant also negotiates";
            case 507:
                return "Insufficient Storage: Server out of storage";
            case 508:
                return "Loop Detected: Infinite loop detected";
            case 509:
                return "Bandwidth Limit Exceeded: Bandwidth limit exceeded";
            case 510:
                return "Not Extended: Not extended";
            case 511:
                return "Network Authentication Required: Network authentication required";
            default:
                return "An error occurred.";
        }
    };

    const errorMessage = getErrorMessage(error);

    return <>{errorMessage}</>;
};

export default StatusCodeHandler;

