import * as cucumber from "cucumber";

export class TestWorld<TBag extends object = any> implements cucumber.World {

    public bag: Partial<TBag> = {};

    private readonly attach: () => void;
    private readonly parameters: any;

    constructor({ attach, parameters }: any) {
        this.attach = attach;
        this.parameters = parameters;
    }

}

cucumber.setWorldConstructor(TestWorld);
