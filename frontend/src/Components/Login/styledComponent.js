import styled from 'styled-components'

export const LoginContainer = styled.div`
    height:100vh;
    width:100vw;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    background-image:linear-gradient(to right,#2f88ed,#ae71f0)
`
export const FormContainer = styled.form`
    height:500px;
    width:550px;
    background-color:#ffffff;
    border-radius:12px;
    display:flex;
    flex-direction:column;
    align-items:center;
    padding:20px;
    padding-top:50px;
    padding-bottom:50px;
`

export const Header = styled.h1`
    font-family:sans-serif;
    font-weight:bold;
    margin-bottom:100px;`

export const InputContainer = styled.input`
    height:40px;
    width:380px;
    font-family:Open Sans;
    color:#000000;
    font-size:20px;
    border: 2px solid #8f8989;
    border-top:none;
    border-right:none;
    border-left:none;
    outline:none;
    margin-bottom:40px;

    ::place-holder{
    color:#8f8989}
`

export const InputPasswordContainer = styled.input`
    height:40px;
    width:380px;
    font-family:Open Sans;
    color:#000000;
    padding:5px;
    font-size:20px;
    border: 2px solid #8f8989;
    border-top:none;
    border-right:none;
    border-left:none;
    outline:none;
    margin-bottom:2px;

    ::place-holder{
    color:#8f8989}
`

export const Container = styled.div`
    display:flex;
    flex-direction:row;
    align-items:center;
    align-self:flex-start;
    margin-left:70px;`

export const CheckboxContainer = styled.input`
    height:20px;
    width:25px;
    font-family:Open Sans;
    color:#000000;
`
export const LabelElement = styled.label`
    font-family:sans-serif;
    color:#000000;`

export const ButtonContainer = styled.button`
    height:55px;
    width:390px;
    font-family:open-sans;
    color:#ffffff;
    background-image:linear-gradient(to right,#2f88ed,#ae71f0);
    font-size:20px;
    border-color:transparent;
    margin-top:50px;
`
export const ErrorMessage = styled.p`
    font-family:sans-serif;
    font-weight:500;
    color:red;`

export const ParagraphElement = styled.p`
    font-family:sans-serif;
    font-weight:450;
    font-size:22px;
    margin-top:90px;
    color: #918e8e;`

export const SpanElement = styled.span`
    color:#3086d1;
    font-family:sans-serif;
    font-size:13px;
    font-weight:400;`

export const ParagraphElementOther = styled.p`
    font-family:sans-serif;
    font-weight:450;
    font-size:15px;
    margin-top:2px;
    color: #918e8e;`