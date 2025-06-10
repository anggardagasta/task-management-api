import {app} from '@azure/functions';
import {SERVER_PORT} from './config/serverConfig';

// For local Cosmos DB Emulator, ignore self-signed certificate errors (development only)
if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

app.setup({
    enableHttpStream: true,
});

console.log(`Azure Functions server running on port ${SERVER_PORT}`);
