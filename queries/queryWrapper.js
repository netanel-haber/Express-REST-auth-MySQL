export default async function executeAction(action, data) {
    console.log(`\n---\nattempting to ${action.name}...\n`);
    let time = Date.now();
    let message = `attempt to ${action.name} was successful`;
    let statusCode = 200;
    let result = null;
    try {
        result = await action(data);
        if (!result.bottomLine) {
            statusCode = 403;
            message = `attempt to ${action.name} was unsuccessful. client error. ${result.summaryOfQueryIfNotSuccess}.`
        }
    }
    catch (ex) {
        statusCode = 500;
        message = `--- attempt to ${action.name} was unsuccessful. server error. ${JSON.stringify(ex)}. ---`;
    }
    console.log(`\n${message}\n`);
    console.log(`${Date.now() - time}ms have passed\n---\n`);
    return { statusCode, result };
}