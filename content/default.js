// default.js
// by jolfosh

var user = 'tmpuser';
const types = ["Directory", "Binary", "Text"];
const fs = {
	items: {
		'bin': {
			type: 0,
			items: {},
		},
		'home': {
			type: 0,
			items:{ 
				'tmpuser': {
					type: 0,
					items: {},
				},
			},
		},
		'etc': {
			type: 0,
			items: {},
		},
		'var': {
			type: 0,
			items: {},
		},
		'tmp': {
			type: 0,
			items: {},
		},
	}
};
const environment = {};

const enterKey = 13;
const upArrowKey = 38;
const downArrowKey = 40;
const history = [''];
const validCommands = ['', 'ls', 'dir', 'print', 'help', 'cd', 'echo'];
var _console = document.querySelector('#console');
var historyIndex = 0;
var path = [];

function print(txt){
	let output = document.createElement('div');
	output.classList.add('cmdline','output');
	output.innerHTML = txt;
	_console.appendChild(output);
	return;
}

function getLocation() {
	let loc = fs;
	path.forEach((val, i) => {
		loc = loc.items[val];	
	});
	return loc;
}

function ls(args) {
	let loc = getLocation();
	try {
		if (args != null){
			let appendedPath = null;
			args.forEach((val, i) => {
				if (val.startsWith('-')){
					//something with options here eventually.
				}
				else {
					if (appendedPath == null) {
						appendedPath = val;
					}
				}
			});
			if (appendedPath != null){
				if (appendedPath.startsWith('/') || appendedPath.startsWith('\\')){
					loc = fs;
				} 
				else if (appendedPath.startsWith('~')){
					loc = fs.items['home'].items[user];
				}
				let arr = appendedPath.split(/([\/\\])/);
				arr.forEach((val, i) => {
					if(val == '.'){
					loc = loc;
					}
					else if (val == '..'){
						throw '.. operator not supported yet in ls/dir statements';
					}
					else if (loc.items[val] != null && loc.items[val] != undefined){
						loc = loc.items[val];
					}
				});
			}
		}
		if(Object.keys(loc.items).length > 0)
			print(Object.keys(loc.items).join('&nbsp;'));	
	}
	catch(e) {
		console.error('error listing items', e);
	}
}
function dir(args) { ls(args); }

function help(){
	let helpText = `WIP. Help text soon`;
	print(helpText);
	return;
}

function echo(args){
	print('WIP');
	return;
}

function cd(args) {
	if(args == null)
		return;
	if(typeof args == typeof Array){
		args = args[0];
	}
	args = `${args}`;
	if(args.startsWith('/') || args.startsWith('\\')){
		path = [];
		if(args == '/' || args == '\\')
			return;
	}
	else if (args.startsWith('~')) {
		path = ['home', user];
		if (args == '~')
			return;
	}
	let loc = getLocation();
	let path_bk = path;
	let arr = args.split(/[\/\\]/);
	console.log({args});
	console.log({arr});
	arr.forEach((val, i) => {
		if (val == '.'){
		//nothing really.
		}
		else if (val == '..'){
			path.pop();
			loc = getLocation();
		}
		else if (val == '~'){
		
		}
		else {
			if ( loc.items[val] != null && loc.items[val] != undefined) {
				path.push(val);
				loc = loc.items[val];
			}
			else {
				console.log({ path });
				console.log({ path_bk });
				print(`Error: Filepath "/${path.join('/')}/${val}" does not exist.`);
				path = path_bk;
				return;
			}
		}
	});
	
}


function executeFunctionByName(functionName, context) {
  var args = Array.prototype.slice.call(arguments, 2);
  var namespaces = functionName.split(".");
  var func = namespaces.pop();
  for(var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }
  return context[func].apply(context, args);
}

function executeCmd(bin, args){
	try{
		if(args != null)
			executeFunctionByName(bin, window, args);
		else
			executeFunctionByName(bin, window);
		}
	catch(e){
		print('Error executing cmd:<br/>&nbsp;- ' + e);
		console.error('Error executing cmd', e);
	}
}

function processCmd(cmd) {
	let input = document.querySelector('#console-textbox');
	let cmdline = input.parentNode;
	let oldcmd = cmdline.textContent + cmd;
	let arr = cmd.split(' ');
	let bin = arr[0];
	if (arr.length > 1)
		arr.shift();
	else 
		arr = null;
	input.remove();
	cmdline.classList.remove('active-line');
	cmdline.innerHTML = `<span class="oldcmd">${oldcmd}</span>`;
	historyIndex = history.length;
	if(history[historyIndex] != cmd) {
		history.push(cmd);
	}
	if(cmd != ''){
		if(validCommands.includes(bin)){
			executeCmd(bin, arr);
		}
		else {
			print(`Error: "${bin}" is not a valid command. Type "help" for a list of valid commands.`);
		}
	}
	_console.innerHTML += `<div class="cmdline active-line">
		<span class="prefix"><span class="user">${user}</span>:${path.join('/')}/&gt; </span>
		<input type="text" id="console-textbox" value="" autofocus />
		</div>`;
	document.querySelector('#console-textbox').focus();
}

document.addEventListener('DOMContentLoaded', (e) => {
	_console = document.querySelector('#console');
	let textbox = document.querySelector('#console-textbox');
	textbox.value = null;

	document.addEventListener('keydown', (ke) => {
		if (ke.which != undefined && ke.which != null){
			let input = document.querySelector('#console-textbox');
			switch(ke.which){
				case enterKey:
					ke.preventDefault();
					processCmd(input.value);
					break;
				case upArrowKey:
					if(historyIndex > 0){
						input.value = history[historyIndex];
						historyIndex--;
					}
					break;
				case downArrowKey:
					if(historyIndex < history.length - 1){
						historyIndex++;
						input.value = history[historyIndex];
					}
					else {
						input.value = null;
					}
					break;
				default:
					break;
			}
		}
	});
});
