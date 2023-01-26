type  Coordinates = {
    x: number,
    y: number
}

const drawArrow = (ctx: CanvasRenderingContext2D, lineStart: Coordinates, lineEnd: Coordinates) => {
    const deltaX = lineEnd.x - lineStart.x;
    const deltaY = lineEnd.y - lineStart.y;
    
    const barbSlopes = calcBarbSlopes(deltaX, deltaY);
    
    const leftBarb = calcBarbEndpoint(barbSlopes.leftSlope, barbSlopes.leftAngle, lineStart, deltaX);
    const rightBarb = calcBarbEndpoint(barbSlopes.rightSlope, barbSlopes.rightAngle, lineStart, deltaX);

    const COLOR = 'white';
    const LINE_WIDTH = 1;

    // straight line
    ctx.beginPath();
    ctx.strokeStyle = COLOR;
    ctx.lineWidth = LINE_WIDTH;
    ctx.moveTo(lineStart.x, lineStart.y);
    ctx.lineTo(lineEnd.x, lineEnd.y);
    ctx.stroke();
    
    // left barb when arrow pointing up
    ctx.beginPath();
    ctx.strokeStyle = COLOR;
    ctx.lineWidth = LINE_WIDTH;
    ctx.moveTo(lineStart.x, lineStart.y);
    ctx.lineTo(leftBarb.x, leftBarb.y);
    ctx.stroke();

    // right barb when arrow pointing up
    ctx.beginPath();
    ctx.strokeStyle = COLOR;
    ctx.lineWidth = LINE_WIDTH;
    ctx.moveTo(lineStart.x, lineStart.y);
    ctx.lineTo(rightBarb.x, rightBarb.y);
    ctx.stroke();
}

const calcBarbEndpoint = (slope: number, angle: number, lineStart: { x: number, y: number }, baseDeltaX: number) => {
    const BARB_LENGTH = 15;

    // don't need to calculate xDirection because the +- function determines x direction later on
    let yDirection;

    if (slope >= 0) {
        yDirection = 1;
    } else {
        yDirection = -1;
    }

    let x;
    let y;

    /*
        How to derive equations to solve for x and y

        solve for x and y so that:
            1) y/x = slope
            2) x^2 + y^2 = BARB_LENGTH^2
        set both equal to y, combine equations, and solve for x
            y/x = slope
            y = slope * x

            EQUATION 1
            y = slope * x

            
            x^2 + y^2 = BARB_LENGTH^2
            y^2 = BARB_LENGTH^2 - x^2
            y = sqrt(BARB_LENGTH^2 - x^2)
            
            EQUATION 2
            y = sqrt(BARB_LENGTH^2 - x^2)
            
            slope * x = sqrt(BARB_LENGTH^2 - x^2)
            slope^2 * x^2 = BARB_LENGTH^2 - x^2
            slope^2 * x^2 = BARB_LENGTH^2 - x^2
            slope^2 * x^2 + x^2 = BARB_LENGTH^2
            x^2(slope^2 + 1) = BARB_LENGTH^2
            x^2 = BARB_LENGTH^2 / (slope^2 + 1)
            x = +- sqrt(BARB_LENGTH^2 / (slope^2 + 1))

            *********************************************
            x = +- sqrt(BARB_LENGTH^2 / (slope^2 + 1))
            *********************************************
            plug x into equation 1 or 2 to get y
    */
   
    // prevent right/left barb from using negative function when it is still on the positive x side and the baseline is on the negative side
    // side note (not needed): if dy > 0, this will be the right barb. If dy < 0, this will be the left barb
    if ((Math.abs(angle) >= Math.PI / 2 && baseDeltaX < 0)) {
        x = (BARB_LENGTH / (Math.sqrt((slope ** 2) + 1)));
    } else if (Math.abs(angle) >= Math.PI / 2 || baseDeltaX < 0) {
        x = -(BARB_LENGTH / (Math.sqrt((slope ** 2) + 1)));
        yDirection *= -1;
    } else {
        x = (BARB_LENGTH / (Math.sqrt((slope ** 2) + 1)));
    }

    y = Math.sqrt((BARB_LENGTH ** 2 - x ** 2));

    let endPoint;

    endPoint = {
        x: lineStart.x + x,
        y: lineStart.y + y * yDirection
    }

    return endPoint;
}

const calcBarbSlopes = (deltaX: number, deltaY: number) => {
    const baseSlope = deltaY / deltaX;

    const baseAngle = Math.atan(baseSlope);

    // create angles +/- .5 radians from base line's angle
    const leftAngle = baseAngle + .5;
    const rightAngle = baseAngle - .5;

    const leftSlope = Math.tan(leftAngle);
    const rightSlope = Math.tan(rightAngle);

    return {
        leftSlope, rightSlope, leftAngle, rightAngle
    }
}

export default drawArrow;