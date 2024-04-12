// default.js
// by jolfosh

const enter = 13;
var _console = document.querySelector('#console');
var _user = 'jolfosh.github.io';
var _dir = '/';

function cmdValid(cmd) {
	return true;
}

function processCmd(cmd) {
	let input = document.querySelector('#console-textbox');
	let cmdline = input.parentNode;
	let oldcmd = cmdline.textContent + cmd;
	console.log(oldcmd);
	input.remove();
	cmdline.classList.remove('active-line');
	cmdline.innerHTML = `<span class="oldcmd">${oldcmd}</span>`;

	if(cmdValid(cmd)){
		//process it here;
	}
	else {
		//print err
	}
	_console.innerHTML += `<div class="cmdline active-line">
		<span class="prefix"><span class="user">${_user}</span>:<span class="dir">${_dir}</span>&gt; </span>
		<input type="text" id="console-textbox" value="" autofocus />
		</div>`;
	document.querySelector('#console-textbox').focus();
}

document.addEventListener('DOMContentLoaded', (e) => {

	_console = document.querySelector('#console');

	document.addEventListener('keydown', (ke) => {
		if (ke.which != undefined && ke.which != null){
			if (ke.which == enter) {
				ke.preventDefault();
				var cmd_in = document.querySelector('#console-textbox');
				console.log(cmd_in.value);
				processCmd(cmd_in.value);
			}
		}
	});
});
