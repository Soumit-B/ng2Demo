import  { Component } from '@angular/core';

@Component({
    selector: 'icabs-footer',
    template: `
        <footer class="parent-footer">
            <div class="custom-footer">&copy; 2016 Rentokil Initial PLC and subject to conditions in the legal statement. 
            <a href="#"><span>Home</span></a> | 
            <a href="https://sites.google.com/a/rentokil-initial.com/it-service-centre/" target="_blank"><span>Help</span></a> | 
            <a href="https://sites.google.com/a/rentokil-initial.com/ri-intranet/" target="_blank"><span>RI-Intranet</span></a> | 
            <a href="https://rentokilinitial.service-now.com/navpage.do/" target="_blank"><span>Service Now</span></a> | 
            <a href="https://sites.google.com/a/rentokil-initial.com/pest-control-in-the-uk/" target="_blank"><span>Speed</span></a>
            </div>            
        </footer>
    `
})

export class FooterComponent {}
