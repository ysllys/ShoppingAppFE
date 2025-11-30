// Import zone.js for server-side rendering (Node) so Angular's NgZone works on the server.
// Use the package's exported entry for Node in newer zone.js versions.
import 'zone.js/node';
import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(AppComponent, config, context);

export default bootstrap;
