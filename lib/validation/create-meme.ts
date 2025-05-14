export enum StepNum {
    ZERO,
    Details,
    UploadFile,
    BondigCurve,
    Review,

}

export const validateMeme = (step:number, state:{ name: string, imageUrl:string, symbol:string, description: string, initialPrice?:number, slope?:number, file?: File})=>{

    let nameValid = /([A-Za-z0-9 ]+)/g.test(state.name) && !!state.name
    let symbolValid = /([A-Za-z0-9]+)/g.test(state.name) && !!state.symbol
    let descriptionValid = !!state.description
    let fileValid = !!state.file && state.file.name && !!state.imageUrl
    let slopeValid = !!state.slope && state.slope >= 0.01 && state.slope <= 0.5
    let initialPriceValid = !!state.initialPrice && state.initialPrice >= 0.0001 && state.initialPrice <= 0.01; 
    if(step == StepNum.Details){
        //Validation of name
        
        return {
            valid: nameValid && symbolValid && descriptionValid,
            nameValid, 
            symbolValid, 
            descriptionValid
        }
    }else if(step == StepNum.UploadFile){

        return {
            valid: nameValid && symbolValid && descriptionValid && fileValid,
            nameValid, 
            symbolValid, 
            descriptionValid,
            fileValid
        }

    }else if(step == StepNum.BondigCurve){
        return {
            valid: nameValid && symbolValid && descriptionValid && fileValid && slopeValid && initialPriceValid,
            nameValid, 
            symbolValid, 
            descriptionValid,
            fileValid,
            initialPriceValid,
            slopeValid
        }   
    }else if(step == StepNum.Review){
        return {
                valid: nameValid && symbolValid && descriptionValid && fileValid,
                nameValid, 
                symbolValid, 
                descriptionValid,
                fileValid
            }          
    }
}