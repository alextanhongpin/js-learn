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
