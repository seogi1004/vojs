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