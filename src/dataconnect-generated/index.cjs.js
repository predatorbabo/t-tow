const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'dz-tow',
  location: 'northamerica-northeast1'
};
exports.connectorConfig = connectorConfig;

const createTowRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTowRequest', inputVars);
}
createTowRequestRef.operationName = 'CreateTowRequest';
exports.createTowRequestRef = createTowRequestRef;

exports.createTowRequest = function createTowRequest(dcOrVars, vars) {
  return executeMutation(createTowRequestRef(dcOrVars, vars));
};

const getTowRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTowRequest', inputVars);
}
getTowRequestRef.operationName = 'GetTowRequest';
exports.getTowRequestRef = getTowRequestRef;

exports.getTowRequest = function getTowRequest(dcOrVars, vars) {
  return executeQuery(getTowRequestRef(dcOrVars, vars));
};

const updateTowRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTowRequest', inputVars);
}
updateTowRequestRef.operationName = 'UpdateTowRequest';
exports.updateTowRequestRef = updateTowRequestRef;

exports.updateTowRequest = function updateTowRequest(dcOrVars, vars) {
  return executeMutation(updateTowRequestRef(dcOrVars, vars));
};

const listAvailableOperatorsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAvailableOperators');
}
listAvailableOperatorsRef.operationName = 'ListAvailableOperators';
exports.listAvailableOperatorsRef = listAvailableOperatorsRef;

exports.listAvailableOperators = function listAvailableOperators(dc) {
  return executeQuery(listAvailableOperatorsRef(dc));
};
