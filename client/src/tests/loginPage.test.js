import { shallowMount } from '@vue/test-utils'
import Login from '@/views/Login.vue'

describe('Login.vue', () => {
    it('renders the login page', () => {                    
        const wrapper = shallowMount(Login)
        expect(wrapper.find('#email-input').exists()).toBe(true)
        expect(wrapper.find('#email').exists()).toBe(true)
        expect(wrapper.find('#password-input').exists()).toBe(true)
        expect(wrapper.find('#password').exists()).toBe(true)
        expect(wrapper.find('#login-btn').exists()).toBe(true)
        expect(wrapper.find('#login-back-btn').exists()).toBe(true)
    })
})


