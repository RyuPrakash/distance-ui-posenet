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
          this.message = `Unable to detect nose , left shoulder , right shoulder properly`
        }
      }
  }


  makeAreaWithNoseAndShoulder(nose,leftShoulder,rightShoulder){
      let num = (nose.x * (leftShoulder.y - rightShoulder.y )) +
                (leftShoulder.x * (rightShoulder.y - nose.y)) +
                (rightShoulder.x * (nose.y - leftShoulder.y))
      return Number(Math.abs( num / 2).toFixed(2))     
  }
}
