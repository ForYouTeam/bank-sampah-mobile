import AsyncStorage from "@react-native-async-storage/async-storage"

// const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNWFiYjcyNTI2OGJjNTBhZDc0ZGRkNDUxYmVjZDdlNmIwMzg2ZGU3YmUxZjliNjBhNWM1NTEzODI5MmU0Y2YyZTExNmI3NDA1MzhkNDE5MGEiLCJpYXQiOjE2OTQ3MzY4NTguNzE0NDM1LCJuYmYiOjE2OTQ3MzY4NTguNzE0NDM3LCJleHAiOjE3MjYzNTkyNTguNjk2NTQsInN1YiI6IjEiLCJzY29wZXMiOltdfQ.iqxvpM9KNjDdI6wUk6OqR3opq3oeFrq0Mu2ThDSBagMm6zsPo02qE4em5iB7KMaXm7ooyAQjIYUed7YvzXRHDvOJVKd52N2Wzc_Y7XeF_q9rLySISML-XOaNFnZMJfMEBfZP7o6PAR6x-xTgdEZ1nVIFSEVe7Ex7NfM4jW3UWovuk0k-mXgYokhyoxx9QVkocfgf0gEBZFBSNzG256VK7pa0dJs8Q7e6cCWw3oDC1k4NVdT7HaFNnvPNzuP6CJAk_ACsJT_xKTVf9ubKj2C1738ZrACos2-VuGCdV-GjXhebEJw1l_Pyzg08Rd-aXowxNDmYVJ0hV-UDZVrCpDKCuCRxn-8fUNYuOOSmEo25NAJFYq7U05JdZsryx2dAXjzzbv9vWRNTDUVcNVhJ9Rl4Im4MPBSL3d86_bDLRQT5plTHmp2K-FLm1duSGSIS7YIoy5bTs7Di-FAr43ulWtStE9cXc9g1avGNE9htRK-D2eu4zGzD2shrh7klMU0HfrAJDxe2gutSiFdTrcOd7YQR-jmjzc54adYQVFnHof4BsDm-q3IU2Mn-4e4w7pZTbAMCt9h8pYM3DvKz03Wzlk_lIjbdrT-aITxmxPit1MK72e4w7XsRSpp49WQS8NXOuT2wWrO_S-AIAe5PfTGjiP8WF7kmtArGPfje1kAHf-WZayI'

export default {
  async setToken(payload) {
    await AsyncStorage.setItem('user', payload)
  },

  async token() {
    return await AsyncStorage.getItem('user')
  }
}