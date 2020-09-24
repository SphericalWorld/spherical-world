module.exports = (babel) => {
  const { types: t } = babel;
  const methods = ['getFloat32', 'getUint8', 'getUint16', 'getUint32'];
  const transpile = (path, state) => {
    const { node } = path;
    if (node.static) return;

    if (!node.value || node.value.type !== 'CallExpression') return;
    const getMethod = path.node.value.callee.property && path.node.value.callee.property.name;
    if (methods.includes(getMethod)) {
      const setMethod = getMethod.replace('get', 'set');
      const dataNode =
        node.type === 'ClassProperty'
          ? t.memberExpression(t.thisExpression(), t.identifier('data'))
          : t.identifier('data');

      // console.log();
      path.replaceWithMultiple([
        t.classMethod(
          'get',
          t.identifier(node.key.name),
          [],
          t.blockStatement([
            t.returnStatement(
              t.callExpression(t.memberExpression(dataNode, t.identifier(getMethod)), [
                t.numericLiteral(state.dataViewIndex),
              ]),
            ),
          ]),
        ),
        t.classMethod(
          'set',
          t.identifier(node.key.name),
          [t.identifier('value')],
          t.blockStatement([
            t.expressionStatement(
              t.callExpression(t.memberExpression(dataNode, t.identifier(setMethod)), [
                t.numericLiteral(state.dataViewIndex),
                t.identifier('value'),
              ]),
            ),
          ]),
        ),
      ]);
    }
    const packed = false;
    switch (getMethod) {
      case 'getFloat32': {
        state.dataViewIndex += 4;
        state.memorySize += 4;
        break;
      }
      case 'getUint8': {
        if (packed) {
          state.dataViewIndex += 1;
          state.memorySize += 1;
        } else {
          state.dataViewIndex += 4;
          state.memorySize += 4;
        }
        break;
      }
      case 'getUint16': {
        if (packed) {
          state.dataViewIndex += 2;
          state.memorySize += 2;
        } else {
          state.dataViewIndex += 4;
          state.memorySize += 4;
        }
        break;
      }
      case 'getUint32': {
        state.dataViewIndex += 4;
        state.memorySize += 4;
        break;
      }
      case 'getVec2': {
        state.memorySize += 8;
        break;
      }
      case 'getVec3': {
        state.memorySize += 12;
        break;
      }
      case 'getQuat': {
        state.memorySize += 16;
        break;
      }
      case 'getMat4': {
        state.memorySize += 64;
        break;
      }
      default: {
      }
    }
    // path.node.name = path.node.name.split('').reverse().join('');
  };
  const transpileConstructor = (path, state) => {
    const { node } = path;
    if (node.static) return;
    if (node.kind !== 'constructor') return;
    node.body.body.splice(
      node.body.body.findIndex(
        (el) =>
          el.type === 'ExpressionStatement' &&
          el.expression.callee &&
          el.expression.callee.type === 'Super',
      ) + 1,
      0,
      t.variableDeclaration('const', [
        t.variableDeclarator(
          t.identifier('data'),
          t.callExpression(
            t.memberExpression(
              t.memberExpression(
                t.identifier(path.parentPath.parent.id.name),
                t.identifier('memoryManager'),
              ),
              t.identifier('getDataView'),
            ),
            [t.numericLiteral(state.dataViewIndex)],
          ),
        ),
      ]),
      t.assignmentExpression(
        '=',
        t.memberExpression(t.thisExpression(), t.identifier('data')),
        t.identifier('data'),
      ),
    );
    // console.log(path.parentPath.parent.id.name);
  };
  return {
    name: 'ast-transform', // not required
    visitor: {
      ClassDeclaration(path) {
        const state = {
          dataViewIndex: 0,
          memorySize: 0,
        };
        path.traverse({
          ClassProperty: (path) => transpile(path, state),
          ObjectProperty: (path) => transpile(path, state),
        });
        if (state.memorySize) {
          path.traverse({
            ClassMethod: (path) => transpileConstructor(path, state),
          });
        }
        const MEMORY_ADRESS_SIZE = 4;
        const totalMemory = Math.ceil(state.memorySize / MEMORY_ADRESS_SIZE) * MEMORY_ADRESS_SIZE;
        path.node.body.body.unshift(
          t.ClassProperty(
            t.Identifier('memorySize'),
            t.NumericLiteral(totalMemory),
            null,
            null,
            null,
            true,
          ),
        );
        // console.log(state);
        // console.log(path.node.body.body);
      },
    },
  };
};
