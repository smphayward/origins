export class HealthProvider{


  public async getHealth(): Promise<object> {

    return {
      currentDateTime: Date.now().toString(),
      environmentVariables: Object.keys(process.env).reduce((prev, curr) => {
        return { ...prev, [curr]: process.env[curr] };
      }, {}),
    };

  }

}