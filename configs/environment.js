// config/environment.js
const prod = {
    baseUrl: "https://apps.abacus.ai/chatllm/",
    ENV: "prod"
};
const preprod = {
    baseUrl: "https://preprod-apps.abacus.ai/chatllm/",
    ENV: "preprod"
};
const stagingLatest = {
    baseUrl: "https://staging-latest-apps.abacus.ai/chatllm/",
    ENV: "stagingLatest"
};
const staging = {
    baseUrl: "https://staging-apps.abacus.ai/chatllm/",
    ENV: "staging"
};
const ENV = process.env.TEST_ENV || "stagingLatest";
const environmentConfig = {
    prod,
    preprod,
    stagingLatest,
    staging,
};
export default environmentConfig[ENV];