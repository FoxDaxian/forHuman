### 捋一捋

- 就react来说，并没有什么难点，照着文档撸就行
- redux方面
    * 三个主要部分：```action``` ```reducer``` ```store```
    * 通过```createStore```创建store
    * 通过```applyMiddleware```使用中间件
    * 通过```combineReducers```合并不同分类的```reducers```，保证单一state
    * [api文档](http://cn.redux.js.org/docs/api/index.html)
- react-redux方面
    * ```Provider```给组件传递store
    * ```connect```传递组件state和dispatch
- react-router方面