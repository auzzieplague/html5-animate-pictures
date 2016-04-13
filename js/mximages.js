/*
    @author michael whinfrey
    @email auzzieplague@gmail.com
    animated image library
    number images 1.ext, 2.ext, ...
    place into folder, specifiy folder as filename and appropriate attributes listed below 
    
    example html:   <div class='mx_anim' filename='image.pic' fps=5 count=4 start =0 fext=".png">more</div>
    
    parameter   default value   purpose
    speed       0               milliseconds of waittime between frames
    fps         0               frames per second (ignored if speed is specified)
    count       1               number of animation frames
    start       0               frame to start animation from
    stop        count           frame to end animation on
    step        1               frame increment
    delay       0               frames to wait before beginning animation
    fext        .png            file extension to use
    
*/

(function() {

    //look for mx_anim divs
    var selectedDivs = document.querySelectorAll('div.mx_anim');

    for (var i = 0; i < selectedDivs.length; i++) {
 
        var CUR=selectedDivs[i];    //current selected div
        
        //ORM -> map attribs to class
        for (var j=0; j< CUR.attributes.length;j++){
            var node=CUR.attributes[j].nodeName;
            CUR[node]=CUR.getAttribute(node);
        }
   
        //handle errors and default values here before passing to timers
        
        if (CUR.fps != undefined) CUR.speed= parseInt(1000/CUR.fps);
        if (CUR.speed == undefined) CUR.speed=0;
        if (CUR.start == undefined) CUR.start=0;
        if (CUR.count == undefined) CUR.count=1;
        if (CUR.stop == undefined) CUR.stop=CUR.count-1;
        if (CUR.delay == undefined) CUR.delay=0;   //frames to wait until anim loops
        if (CUR.step == undefined) CUR.step=1;
        if (CUR.fext == undefined) CUR.fext=".png";
        
        //do either static image or spawn timer
        if (CUR.speed ==0 || CUR.count==1) 
        {   
            if (CUR.filename == undefined) CUR.filename="js/picnotfound.png";
            else CUR.filename = CUR.filename+"/"+CUR.start+CUR.fext;
            staticPic (CUR);
        }
        else {
            CUR.filename = CUR.filename+"/";
            CUR.frame = CUR.start;
            preloadImages(CUR);
            spawnTimer (CUR);
        }
    }
    
    function spawnTimer (iDiv) {
        iDiv.replaceChild(iDiv.imageList["image"+iDiv.frame],iDiv.firstChild);
        if (iDiv.delay > 0) {
           iDiv.delay --;
        }
        else
        {
            if (iDiv.frame<iDiv.stop) {
                iDiv.frame=Number(iDiv.frame)+Number(iDiv.step);
            }
            else iDiv.frame=iDiv.start;
        }
        
        setTimeout(function(){ spawnTimer(iDiv); }, iDiv.speed.toString());
    }
    
    function staticPic (iDiv){
        iDiv.innerHTML = "<img src='"+iDiv.filename+"' />";
    }

    function preloadImages (div){
        div.imageList = {};

        for (var i=0;i<div.count;i++){
            div.imageList["image"+i] = new Image();
            div.imageList["image"+i].src = div.filename+i+div.fext;
        }
    }
    
}())