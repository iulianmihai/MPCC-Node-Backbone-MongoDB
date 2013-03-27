module.exports = {
    service: "SendGrid",
    host: "localhost",
    port: 587,
    secureConnection: false,
    name: "localhost",
    auth: {
        user: "myusername",
        pass: "mypassword"
    },
    ignoreTLS: false,
    debug: false,
    maxConnections: 5 // Default is 5
}
