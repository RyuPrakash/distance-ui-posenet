import { Injectable } from '@angular/core';
import * as distance from './trained-net.js'
@Injectable()
export class PosenetService {
  message:string = ''
  scoreThreshold = 0.50
  constructor() { }

  manipulateKeyPoints(keypoints){
      let clearPoints = keypoints.filter(item => item.score > this.scoreThreshold)
      if(clearPoints.length == 0){
        this.message = `Unable to see you.`
      } else {

        let nose = clearPoints.filter(item => item.part == 'nose')
        let leftShoulder = clearPoints.filter(item => item.part == 'leftShoulder')
        let rightShoulder = clearPoints.filter(item => item.part == 'rightShoulder')

        if(nose.length>0){
          nose = nose[0]['position']
          nose.x = Number(nose.x)
          nose.y = Number(nose.y)
        } else {
          nose = null
        }
        if(leftShoulder.length>0){
          leftShoulder = leftShoulder[0]['position']
          leftShoulder.x = Number(leftShoulder.x)
          leftShoulder.y = Number(leftShoulder.y)
        } else {
          leftShoulder = null
        }

        if(rightShoulder.length>0){
          rightShoulder = rightShoulder[0]['position']
          rightShoulder.x = Number(rightShoulder.x)
          rightShoulder.y = Number(rightShoulder.y)
        } else {
          rightShoulder = null
        }
        
        if(nose && leftShoulder && rightShoulder){
          const zeroArea = 84000;
          let testingArea = this.makeAreaWithNoseAndShoulder(nose,leftShoulder,rightShoulder)
          const perChange = Math.abs(((zeroArea - testingArea) * 100) / zeroArea);
          const dst = distance.run([perChange])

          this.message = `${dst.toFixed(2)} m`
        } else {
          this.message = `Unable to detect you properly`
        }
      }
  }


  makeAreaWithNoseAndShoulder(nose,leftShoulder,rightShoulder){
      let num = (nose.x * (leftShoulder.y - rightShoulder.y )) +
                (leftShoulder.x * (rightShoulder.y - nose.y)) +
                (rightShoulder.x * (nose.y - leftShoulder.y))
      return Number(Math.abs( num / 2).toFixed(2))     
  }

  setDistanceForImageCapture(x, y , yDistance , xDistance , keypoints ){
    let clearPoints = keypoints.filter(item => item.score > this.scoreThreshold)

    let nose = clearPoints.filter(item => item.part == 'nose')
    // let leftShoulder = clearPoints.filter(item => item.part == 'leftShoulder')
    // let rightShoulder = clearPoints.filter(item => item.part == 'rightShoulder')
    let leftEye = clearPoints.filter(item => item.part == 'leftEye')
    let rightEye = clearPoints.filter(item => item.part == 'rightEye')

    if(!nose.length || !leftEye.length || !rightEye.length ){
          this.message = `Please center your face within the circle.`
    } else  {
      leftEye = leftEye[0]['position']
      let leftEyePosition = this.checkpoint(x, y, Number(leftEye.x) , Number(leftEye.y) , xDistance, yDistance)
      
      if(leftEyePosition>=1){
        this.message = `Please center your face within the circle.`
        return false 
      }

      rightEye = rightEye[0]['position']
      let rightEyePosition = this.checkpoint(x, y, Number(rightEye.x) , Number(rightEye.y) , xDistance, yDistance)
      if(rightEyePosition>=1){
        this.message = `Please center your face within the circle.`
        return false 
      }    
      
      nose = nose[0]['position'] 
      let nosePosition = this.checkpoint(x, y, Number(nose.x) , Number(nose.y) , xDistance, yDistance)
      if(nosePosition>=1){
        this.message = `Please center your face within the circle.`
        return false 
      } 

      // leftShoulder = leftShoulder[0]['position']
      // let leftShoulderPosition = this.checkpoint(x, y, Number(leftShoulder.x) , Number(leftShoulder.y) , xDistance, yDistance)
      // if(leftShoulderPosition < 1){
      //   this.message = `Please center your face within the circle.`
      //   return false 
      // } 

      // rightShoulder = rightShoulder[0]['position']
      // let rightShoulderPosition = this.checkpoint(x, y, Number(rightShoulder.x) , Number(rightShoulder.y) , xDistance, yDistance)
      // if(rightShoulderPosition < 1){
      //   this.message = `Please center your face within the circle.`
      //   return false 
      // } 


      this.message = `Please maintain position for capture image`
      return true
    }
  }


  checkpoint(h, k,  x,  y,  a, b) { 
    let p = (Math.pow((x - h), 2) / Math.pow(a, 2)) 
            + (Math.pow((y - k), 2) / Math.pow(b, 2)); 
  
      return p; 
  } 
}
