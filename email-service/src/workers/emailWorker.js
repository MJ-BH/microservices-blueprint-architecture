const { getChannel, QUEUE_NAME } = require('../config/rabbitmq');
const createTransporter = require('../config/transporter');
const renderTemplate = require('../templates/emailTemplate');
const nodemailer = require('nodemailer'); 

const MAX_RETRIES = 3;

const startWorker = async () => {
    const channel = getChannel();
    if (!channel) {
        console.log("⏳ Worker waiting for RabbitMQ...");
        setTimeout(startWorker, 1000);
        return;
    }

    const transporter = await createTransporter();
    console.log("📧 Worker Listening for messages...");

    channel.consume(QUEUE_NAME, async (msg) => {
        if (msg !== null) {
            const content = JSON.parse(msg.content.toString());
            const currentRetries = content.retryCount || 0;

            console.log(`📨 Processing: ${content.email} (Attempt: ${currentRetries + 1})`);

            try {
                // 1. Render & Send
                const htmlContent = renderTemplate(content.name, content.url);
                
                const info = await transporter.sendMail({
                    from: '"Microservices Architecture" <no-reply@microservices.com>',
                    to: content.email,
                    subject: "Your Generated URL",
                    html: htmlContent
                });

                console.log("✅ Sent: %s", info.messageId);
                console.log("🔗 Preview URL: %s", nodemailer.getTestMessageUrl(info));

                // 2. Success: Remove message
                channel.ack(msg);

            } catch (error) {
                console.error(`❌ Failed: ${error.message}`);

                // 3. RETRY LOGIC
                if (currentRetries < MAX_RETRIES) {
                    console.warn(`⚠️ Re-queueing (Attempt ${currentRetries + 1} failed)`);
                    
                    // Update retry count
                    content.retryCount = currentRetries + 1;

                    // Put back at the end of the queue
                    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(content)));
                    
                    // Remove the old failed message
                    channel.ack(msg); 
                } else {
                    console.error(`💀 Max retries reached for ${content.email}. Dropping message.`);
                    
                    // Acknowledge (Drop) the message to stop the loop
                    channel.ack(msg);
                }
            }
        }
    });
};

module.exports = startWorker;