/*
The contents of this file are subject to the Netscape Public
License Version 1.1 (the "License"); you may not use this file
except in compliance with the License. You may obtain a copy of
the License at http://www.mozilla.org/NPL/

Software distributed under the License is distributed on an "AS
IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or
implied. See the License for the specific language governing
rights and limitations under the License.

The Initial Developer of the Original Code is Doron Rosenberg

Alternatively, the contents of this file may be used under the
terms of the GNU Public License (the "GPL"), in which case the
provisions of the GPL are applicable instead of those above.
If you wish to allow use of your version of this file only
under the terms of the GPL and not to allow others to use your
version of this file under the NPL, indicate your decision by
deleting the provisions above and replace them with the notice
and other provisions required by the GPL.  If you do not delete
the provisions above, a recipient may use your version of this
file under either the NPL or the GPL.

Contributor(s):  Doron Rosenberg, doronr@gmx.net
                 Bob Clary, Netscape Communications, Copyright 2001
*/

/*
stock-ticker.js Version 0.2

this script animates a ticker consisting of a div containing a sequence of 
spans.	the div is shifted to the left by shiftBy pixels every interval ms.
As the second visible span reaches the left of the screen, the first is appended to 
the end of the div's children.

See http://devedge.netscape.com/toolbox/examples/2001/stock-ticker/

Change Log: Version 0.1 - Doron Rosenberg, August 1, 2001
            Initial Contribution
            
            Version 0.2 - Bob Clary, August 1, 2001
            added runId property and removed run property, removed
            animate() method since start() handles functionality,
            fixed problems with calling start() multiple times creating 
            multiple threads resulting in an apparent speed up of the Ticker.

Constructor Ticker(name, id, shiftBy, interval)

Methods
=======
Ticker.start()
       starts the animation of the ticker
       
Ticker.stop()
       stops the animation of the ticker
       
Ticker.changeInterval(newinterval)
       changes the shifting interval to newinterval

Properties
==========
Ticker.name
	String : name of global variable containing reference to the ticker object

Ticker.id
	String : id of the DIV containing the Ticker data

Ticker.shiftBy
	Number : Number of pixels to shift the Ticker each time it fires.
	
Ticker.interval
    Number : Number of millisecond intervals between times Ticker fires
    
Ticker.runId
    Number : Value returned from setTimeout or null if the Ticker is not 
             running
             
Ticker.div
    HTMLElement : Reference to DIV containing the Ticker data.
  
*/

function Ticker(name, id, shiftBy, interval)
{
  this.name     = name;
  this.id       = id;
  this.shiftBy  = shiftBy ? shiftBy : 1;
  this.interval = interval ? interval : 100;
  this.runId	= null;

  this.div = document.getElementById(id);

  // remove extra textnodes that may separate the child nodes
  // of the ticker div

  var node = this.div.firstChild;
  var next;

  while (node)
  {
    next = node.nextSibling;
    if (node.nodeType == 3)
      this.div.removeChild(node);
    node = next;
  }

  //end of extra textnodes removal
 
  this.left = 0;
  this.shiftLeftAt = this.div.firstChild.offsetWidth;
  this.div.style.height	= this.div.firstChild.offsetHeight;
  this.div.style.width = 2 * screen.availWidth;
  this.div.style.visibility = 'visible';
}

function startTicker()
{
  this.stop();
  
  this.left -= this.shiftBy;

  if (this.left <= -this.shiftLeftAt)
  {
    this.left = 0;
    this.div.appendChild(this.div.firstChild);
  
    this.shiftLeftAt = this.div.firstChild.offsetWidth;
  }

  this.div.style.left = (this.left + 'px');

  this.runId = setTimeout(this.name + '.start()', this.interval);
}

function stopTicker()
{
  if (this.runId)
    clearTimeout(this.runId);
    
  this.runId = null;
}

function changeTickerInterval(newinterval)
{

  if (typeof(newinterval) == 'string')
    newinterval =  parseInt('0' + newinterval, 10); 
	
  if (typeof(newinterval) == 'number' && newinterval > 0)
    this.interval = newinterval;
    
    this.stop();
    this.start();
}

/* Prototypes for Ticker */
Ticker.prototype.start = startTicker;
Ticker.prototype.stop = stopTicker;
Ticker.prototype.changeInterval = changeTickerInterval;