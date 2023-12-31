import { sleep } from "../../src/Extensions/TimeExtensions";


describe("TimeExtensions", () => {
    jest.useFakeTimers();
    jest.spyOn(global, "setTimeout")

    test("Sleep method", () => {
        const timeout: number = 2;

        sleep(timeout);
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), timeout)
    })
})