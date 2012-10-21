<!-- Modal Popup, Add Person -->
<div id="showInput" class="modal hide">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal">x</button>
		<h3>Person Information</h3>
	</div>
	<div class="modal-body">
		<form class="form-horizontal">
		<fieldset>
			<div class="control-group">
	            <label class="control-label" for="input01">Name</label>
	            <div class="controls">
					<input type="text" class="input-xlarge" data-tag="person:name">
	            </div>
			</div>
			<div class="control-group">
	            <label class="control-label" for="input01">Age</label>
	            <div class="controls">
					<input type="text" class="input-xlarge" data-tag="person:age">
	            </div>
			</div>
			<div class="control-group">
	            <label class="control-label" for="input01">Location</label>
	            <div class="controls">
					<input type="text" class="input-xlarge" data-tag="person:location">
	            </div>
			</div>
		</fieldset>
		</form>
	</div>
	<div class="modal-footer">
	    <a href="#" class="btn" data-dismiss="modal">Close</a>
	    <a href="#" class="btn btn-primary" data-act="addPerson:top">Add Top</a>
	    <a href="#" class="btn btn-primary" data-act="addPerson:bottom">Add Bottom</a>
	</div>
</div>

<!-- Template, Person List -->
<script data-tpl="personList" type="text/template">
	<% for(var i in persons) { %>
	<tr>
		<td><%= persons[i].name %></td>
		<td><%= persons[i].age %></td>
		<td><%= persons[i].location %></td>
		<td><button class="btn btn-mini" type="button" data-act="deletePerson:<%= i %>" data-type="<%= type %>">Delete</button></td>
	</tr>
	<% } %>
</script>