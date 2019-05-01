import { randomNumBetween } from '../../helpers/calculationHelper';
export default class Fuel {
    constructor(args) {
        this.position = args.position
        this.velocity = {
            x: randomNumBetween(-2, 2),
            y: randomNumBetween(-2, 2)
          }
        this.radius = args.size;
        this.addScore = args.addScore;
        this.score = 5;
    }
    destroy() {
        this.delete = true;
        this.addScore(this.score);
    }

    render(state) {
        //move
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        // Screen edges
        if(this.position.x > state.screen.width + this.radius) this.position.x = -this.radius;
        else if(this.position.x < -this.radius) this.position.x = state.screen.width + this.radius;
        if(this.position.y > state.screen.height + this.radius) this.position.y = -this.radius;
        else if(this.position.y < -this.radius) this.position.y = state.screen.height + this.radius;
        // Draw
        const context = state.context;
        context.save();
        context.translate(this.position.x, this.position.y);
        context.fillStyle = '#ffffff';
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(0, -this.radius);
        context.arc(0, 0, this.radius, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
        context.restore();

    }
}