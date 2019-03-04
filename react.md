## Api
Decouple apis calls for the frontend. It makes refactoring easier, and changes only occurs in one place.

```js
// api/user.js
const Api = {
    async getUsers(req) {
        const response = await axios.GET('/some_url')
        if (response.status !== 200) {
            throw new Error(response.data.error)
        }
        return response.data
    }
}

// action.js
const fetchUsers = () => async (dispatch) => {
    try {
        const response = UserApi.fetchUsers(id)
        // Do something with the response
    } catch (error) {
        // Do something with the error
    } finally {
        // Remove loading animation, or cleanup.
    }
}
```

# React context and reducer with TypeScript

```tsx
import React, { useReducer, Dispatch, Reducer } from 'react';

import { A, B } from './models';

interface State {
  a: A[];
  b: Map<string, B>;
}

type Action =
  | { type: 'SET_A'; data: A[] }
  | { type: 'SET_B'; data: B[] };

export interface HomePageContext {
  state: State;
  dispatch: Dispatch<Action>;
}

const initialState = {
  a: [],
  b: new Map()
};

const PageContext = React.createContext<HomePageContext>({
  state: initialState,
  dispatch: function(act: Action) {},
});

const reducer: Reducer<State, Action> = (
  state: State,
  action: Action,
): State => {
  switch (action.type) {
    case 'SET_A':
      return { ...state, a: action.data };
    case 'SET_EMPLOYEES':
       const dict = state.b
       for (let emp of action.data) {
	       dict.set(emp.id, emp)
       }
      return { ...state, a: action.data, b: dict };
    default:
      return state;
  }
};

export function PageContextProvider({ children }: any) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}

export default PageContext;
```
