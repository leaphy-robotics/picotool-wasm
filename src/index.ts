// @ts-ignore
import Module from '../build/picotool'

interface ModuleType {
    callMain: (args: string[]) => number,
    FS: {
        writeFile: (file: string, data: Uint8Array) => void
    }
}

export default class PicoTool {
    private onDone?: () => void
    private logs?: string

    constructor(private prefix: string) { }

    getModule(): Promise<ModuleType> {
        return Module({
            locateFile: (file: string) => {
                return this.prefix + file
            },
            print: (text: string) => {
                if (typeof this.onDone === 'undefined' || typeof this.logs === 'undefined') return
                this.logs += `${text}\n`

                if (!text.includes('OK')) return

                this.onDone()
            }
        })
    }

    async flash(sketch: Uint8Array) {
        const module = await this.getModule()
        module.FS.writeFile('sketch.uf2', sketch)

        return Promise.race([
            new Promise<void>((_resolve, reject) => setTimeout(() => reject(this.logs), 5000)),
            new Promise<void>((resolve) => {
                this.onDone = resolve
                this.logs = ''
                module.callMain(["load", "-v", "-x", "/sketch.uf2", "-f"])
            })
        ])
    }
}
