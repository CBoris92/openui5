/*global QUnit, sinon */

sap.ui.require([
	"sap/ui/table/Table",
	"sap/ui/table/Column"
], function(Table, Column) {
	"use strict";

	sinon.config.useFakeTimers = true;

	QUnit.module("API", {
		beforeEach: function() {
			this._oColumn = new Column();
		},
		afterEach: function() {
			this._oColumn.destroy();
		}
	});

	QUnit.test("shouldRender", function(assert) {
		var that = this;

		function test(bShouldRender, bVisible, bGrouped, vTemplate) {
			that._oColumn.setVisible(bVisible);
			that._oColumn.setGrouped(bGrouped);
			that._oColumn.setTemplate(vTemplate);

			assert.strictEqual(that._oColumn.shouldRender(), bShouldRender,
				"Returned " + bShouldRender + ": "
				+ (bVisible ? "Visible" : "Not visible")
				+ ", " + (bGrouped ? "grouped" : "not grouped")
				+ ", " + (vTemplate != null ? ",has template" : "has no template"));
		}

		test(true, true, false, "dummy");
		test(false, true, true, "dummy");
		test(false, false, false, "dummy");
		test(false, false, true, "dummy");
		test(false, true, true, null);
		test(false, true, false, null);
		test(false, false, false, null);
		test(false, false, true, null);
	});

	QUnit.module("Aggregations", {
		beforeEach: function() {
			this._oColumn = new Column();
		},
		afterEach: function() {
			this._oColumn.destroy();
		}
	});

	QUnit.test("Label", function(assert) {
		assert.equal(this._oColumn.getLabel(), null, "The column has no label defined");

		this._oColumn.setLabel("labelstring");
		var oLabel = this._oColumn.getLabel();
		assert.notEqual(oLabel, null, "Added label by passing a string");
		assert.strictEqual(oLabel.getText(), "labelstring", "The text of the label is correct");

		var oNewLabel = new sap.m.Label({text: "labelinstance"});
		this._oColumn.setLabel(oNewLabel);
		assert.notEqual(oNewLabel, null, "Added label by passing a sap.m.Label instance");
		assert.notEqual(oLabel, oNewLabel, "The column has a new label");
		assert.strictEqual(oNewLabel.getText(), "labelinstance", "The text of the label is correct");
	});

	QUnit.test("setTemplate", function(assert) {
		assert.equal(this._oColumn.getTemplate(), null, "The column has no template defined");

		this._oColumn.setTemplate("bindingpath");
		var oTemplate = this._oColumn.getTemplate();
		assert.notEqual(oTemplate, null, "Added template by passing a string");
		assert.strictEqual(oTemplate.getBindingPath("text"), "bindingpath", "The binding path of the template is correct");

		var oNewTemplate = new sap.m.Text({text: "{anotherbindingpath}"});
		this._oColumn.setTemplate(oNewTemplate);
		assert.notEqual(oNewTemplate, null, "Added template by passing a sap.m.Text instance");
		assert.notEqual(oTemplate, oNewTemplate, "The column has a new template");
		assert.strictEqual(oNewTemplate.getBindingPath("text"), "anotherbindingpath", "The binding path of the template is correct");
	});

	QUnit.module("Column Menu Items", {
		beforeEach: function() {
			this._oTable = new Table();
			this._oColumn = new Column();
		},
		afterEach: function() {
			this._oColumn.destroy();
			this._oTable.destroy();
		}
	});

	QUnit.test("Pre-Check Menu Item Creation", function(assert) {

		//######################################################################################################
		// Filter menu item
		//######################################################################################################
		this._oColumn.setFilterProperty("");
		this._oColumn.setShowFilterMenuEntry(true);

		assert.ok(!this._oColumn.isFilterableByMenu(),
			"Not filterable by menu:"
			+ " filterProperty: '" + (this._oColumn.getFilterProperty() ? this._oColumn.getFilterProperty() : "") + "'"
			+ ", showFilterMenuEntry: " + this._oColumn.getShowFilterMenuEntry());

		this._oColumn.setShowFilterMenuEntry(false);
		assert.ok(!this._oColumn.isFilterableByMenu(),
			"Not filterable by menu:"
			+ " filterProperty: '" + (this._oColumn.getFilterProperty() ? this._oColumn.getFilterProperty() : "") + "'"
			+ ", showFilterMenuEntry: " + this._oColumn.getShowFilterMenuEntry());

		this._oColumn.setFilterProperty("myFilterPropertyName");
		assert.ok(!this._oColumn.isFilterableByMenu(),
			"Not filterable by menu:"
			+ " filterProperty: '" + (this._oColumn.getFilterProperty() ? this._oColumn.getFilterProperty() : "") + "'"
			+ ", showFilterMenuEntry: " + this._oColumn.getShowFilterMenuEntry());

		this._oColumn.setShowFilterMenuEntry(true);
		assert.ok(this._oColumn.isFilterableByMenu(),
			"Not filterable by menu:"
			+ " filterProperty: '" + (this._oColumn.getFilterProperty() ? this._oColumn.getFilterProperty() : "") + "'"
			+ ", showFilterMenuEntry: " + this._oColumn.getShowFilterMenuEntry());

		//######################################################################################################
		// Sort menu item
		//######################################################################################################
		this._oColumn.setSortProperty("");
		this._oColumn.setShowSortMenuEntry(true);

		assert.ok(!this._oColumn.isSortableByMenu(),
			"Not sortable by menu:"
			+ " sortProperty: '" + (this._oColumn.getSortProperty() ? this._oColumn.getSortProperty() : "") + "'"
			+ ", showSortMenuEntry: " + this._oColumn.getShowSortMenuEntry());

		this._oColumn.setShowSortMenuEntry(false);
		assert.ok(!this._oColumn.isSortableByMenu(),
			"Not sortable by menu:"
			+ " sortProperty: '" + (this._oColumn.getSortProperty() ? this._oColumn.getSortProperty() : "") + "'"
			+ ", showSortMenuEntry: " + this._oColumn.getShowSortMenuEntry());

		this._oColumn.setSortProperty("mySortPropertyName");
		assert.ok(!this._oColumn.isSortableByMenu(),
			"Not sortable by menu:"
			+ " sortProperty: '" + (this._oColumn.getSortProperty() ? this._oColumn.getSortProperty() : "") + "'"
			+ ", showSortMenuEntry: " + this._oColumn.getShowSortMenuEntry());

		this._oColumn.setShowSortMenuEntry(true);
		assert.ok(this._oColumn.isSortableByMenu(),
			"Not sortable by menu:"
			+ " sortProperty: '" + (this._oColumn.getSortProperty() ? this._oColumn.getSortProperty() : "") + "'"
			+ ", showSortMenuEntry: " + this._oColumn.getShowSortMenuEntry());

		//######################################################################################################
		// Group menu item
		//######################################################################################################

		// reset Column Properties
		this._oColumn.setFilterProperty("");
		this._oColumn.setShowFilterMenuEntry(true);
		this._oColumn.setSortProperty("");
		this._oColumn.setShowSortMenuEntry(true);

		// check column without parent
		this._oTable.setEnableGrouping(true);
		this._oColumn.setSortProperty("mySortPropertyName");
		assert.ok(!this._oColumn.isGroupable(),
			"Not groupable by menu:"
			+ " parent: '" + (this._oColumn.getParent() ? "Has parent" : "No Parent") + "'"
			+ ", sortProperty: '" + (this._oColumn.getSortProperty() ? this._oColumn.getSortProperty() : "") + "'"
			+ ", enableGrouping: " + this._oTable.getEnableGrouping());

		// check column with parent
		this._oTable.addColumn(this._oColumn);

		this._oTable.setEnableGrouping(true);
		this._oColumn.setSortProperty("");
		assert.ok(!this._oColumn.isGroupable(),
			"Not groupable by menu:"
			+ " parent: '" + (this._oColumn.getParent() ? "Has parent" : "No Parent") + "'"
			+ ", sortProperty: '" + (this._oColumn.getSortProperty() ? this._oColumn.getSortProperty() : "") + "'"
			+ ", enableGrouping: " + this._oTable.getEnableGrouping());

		this._oTable.setEnableGrouping(false);
		assert.ok(!this._oColumn.isGroupable(),
			"Not groupable by menu:"
			+ " parent: '" + (this._oColumn.getParent() ? "Has parent" : "No Parent") + "'"
			+ ", sortProperty: '" + (this._oColumn.getSortProperty() ? this._oColumn.getSortProperty() : "") + "'"
			+ ", enableGrouping: " + this._oTable.getEnableGrouping());

		this._oColumn.setSortProperty("mySortPropertyName");
		assert.ok(!this._oColumn.isGroupable(),
			"Not groupable by menu:"
			+ " parent: '" + (this._oColumn.getParent() ? "Has parent" : "No Parent") + "'"
			+ ", sortProperty: '" + (this._oColumn.getSortProperty() ? this._oColumn.getSortProperty() : "") + "'"
			+ ", enableGrouping: " + this._oTable.getEnableGrouping());

		this._oTable.setEnableGrouping(true);
		assert.ok(this._oColumn.isGroupable(),
			"Not groupable by menu:"
			+ " parent: '" + (this._oColumn.getParent() ? "Has parent" : "No Parent") + "'"
			+ ", sortProperty: '" + (this._oColumn.getSortProperty() ? this._oColumn.getSortProperty() : "") + "'"
			+ ", enableGrouping: " + this._oTable.getEnableGrouping());
	});

	QUnit.module("Column Menu", {
		beforeEach: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData([{myProp: "someValue", myOtherProp: "someOtherValue"}]);
			this._oTable = new Table();
			this._oTable.bindRows("/");
			this._oTable.setModel(oModel);
			this._oColumnWithColumnMenu = new Column({
				filterProperty: "myProp",
				showFilterMenuEntry: true
			});

			this._oColumnWithUnifiedMenu = new Column({
				filterProperty: "myOtherProp",
				showFilterMenuEntry: true,
				menu: new sap.ui.unified.Menu()
			});

			this._oTable.addColumn(this._oColumnWithColumnMenu);
			this._oTable.addColumn(this._oColumnWithUnifiedMenu);

			this._oTable.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this._oColumnWithColumnMenu.destroy();
			this._oColumnWithUnifiedMenu.destroy();
			this._oTable.destroy();
		}
	});

	QUnit.test("Filter on Column with ColumnMenu and UnifiedMenu", function(assert) {
		var oColumnMenu = this._oColumnWithColumnMenu.getMenu();
		var oSpyColumnMenu = this.spy(oColumnMenu, "_setFilterValue");
		this._oColumnWithColumnMenu.filter("filterValue");
		this._oColumnWithColumnMenu._openMenu();

		var oFilterField = sap.ui.getCore().byId(oColumnMenu.getId() + "-filter");
		assert.equal(oFilterField.getValue(), "filterValue", "Filter value set on ColumnMenu");
		assert.ok(oSpyColumnMenu.called, "_setFilterValue called on ColumnMenu");

		var oUnifiedMenu = this._oColumnWithUnifiedMenu.getMenu();
		// implement a dummy function to allow usage of sinon.spy
		oUnifiedMenu._setFilterValue = function() {};
		var oSpyUnifiedMenu = this.spy(oUnifiedMenu, "_setFilterValue");

		// if filter is called on a column, the filter state of the other columns must be updated as well
		var oSpyColumnMenuFilterState = this.spy(oColumnMenu, "_setFilterState");
		this._oColumnWithUnifiedMenu.filter("filterValue");
		assert.ok(!oSpyUnifiedMenu.called, "_setFilterValue not called on UnifiedMenu");
		assert.ok(oSpyColumnMenuFilterState.calledOnce, "_setFilterState called on ColumnMenu");
	});

	QUnit.test("Localization and Invalidation", function(assert) {
		var oColumnMenu = this._oColumnWithColumnMenu.getMenu();
		this._oColumnWithColumnMenu._openMenu();

		assert.ok(!oColumnMenu._bInvalidated, "ColumnMenu not invalidated");
		this._oTable._invalidateColumnMenus();
		assert.ok(oColumnMenu._bInvalidated, "ColumnMenu invalidated");
		this._oColumnWithColumnMenu._openMenu();
		assert.ok(!oColumnMenu._bInvalidated, "ColumnMenu not invalidated");
	});

	QUnit.module("Template Clones", {
		beforeEach: function() {
			this.oColumn = new Column();
			this.oCloneWithParent = {
				getParent: function() {
					return "i have a parent";
				},
				destroy: function() {}
			};
			this.oCloneWithoutParentA = {
				getParent: function() {
					return undefined;
				},
				destroy: function() {}
			};
			this.oCloneWithoutParentB = {
				getParent: function() {
					return undefined;
				},
				destroy: function() {}
			};
			this.oDestroyedClone = {
				bIsDestroyed: true
			};
		},
		afterEach: function() {
		}
	});

	QUnit.test("_getFreeTemplateClone: No free template clone available", function(assert) {
		this.oColumn._aTemplateClones = [
			null,
			this.oCloneWithParent,
			this.oDestroyedClone
		];

		var oFreeTemplateClone = this.oColumn._getFreeTemplateClone();

		assert.strictEqual(oFreeTemplateClone, null, "Returned null");
		assert.deepEqual(this.oColumn._aTemplateClones, [this.oCloneWithParent], "The clone stack has been cleaned up");
	});

	QUnit.test("_getFreeTemplateClone: Free template clones available", function(assert) {
		this.oColumn._aTemplateClones = [
			null,
			this.oCloneWithParent,
			this.oCloneWithoutParentA,
			this.oDestroyedClone,
			this.oCloneWithoutParentB
		];

		var oFreeTemplateClone = this.oColumn._getFreeTemplateClone();

		assert.strictEqual(oFreeTemplateClone, this.oCloneWithoutParentA, "Returned the first free template clone");
		assert.deepEqual(this.oColumn._aTemplateClones, [
			this.oCloneWithParent,
			this.oCloneWithoutParentA,
			this.oCloneWithoutParentB
		], "The clone stack has been cleaned up");
	});

	QUnit.test("getTemplateClone: No index passed", function(assert) {
		var oGetFreeTemplateCloneSpy = sinon.spy(this.oColumn, "_getFreeTemplateClone");
		var oGetTemplateSpy = sinon.spy(this.oColumn, "getTemplate");

		var oTemplateClone = this.oColumn.getTemplateClone();

		assert.strictEqual(oTemplateClone, null, "Returned null");
		assert.deepEqual(this.oColumn._aTemplateClones, [], "No template clones exist");
		assert.ok(oGetFreeTemplateCloneSpy.notCalled, "Column#_getFreeTemplateClone has not been called");
		assert.ok(oGetTemplateSpy.notCalled, "Column#getTemplate has not been called");
	});

	QUnit.test("getTemplateClone: No column template is defined", function(assert) {
		var oGetFreeTemplateCloneSpy = sinon.spy(this.oColumn, "_getFreeTemplateClone");
		var oGetTemplateSpy = sinon.spy(this.oColumn, "getTemplate");

		var oTemplateClone = this.oColumn.getTemplateClone(0);

		assert.strictEqual(oTemplateClone, null, "Returned null");
		assert.deepEqual(this.oColumn._aTemplateClones, [], "No template clones exist");
		assert.ok(oGetFreeTemplateCloneSpy.calledOnce, "Column#_getFreeTemplateClone has been called once");
		assert.ok(oGetTemplateSpy.calledOnce, "Column#getTemplate has been called once");
	});

	QUnit.test("getTemplateClone: No template clones exist -> Create a new template clone", function(assert) {
		var oTemplate = new sap.m.Text();
		this.oColumn.setTemplate(oTemplate);

		var oGetFreeTemplateCloneSpy = sinon.spy(this.oColumn, "_getFreeTemplateClone");
		var oGetTemplateSpy = sinon.spy(this.oColumn, "getTemplate");
		var oControlCloneSpy = sinon.spy(oTemplate, "clone");

		var oTemplateClone = this.oColumn.getTemplateClone(5);

		assert.notEqual(oTemplateClone, null, "Returned the created template clone");
		assert.strictEqual(this.oColumn._aTemplateClones.length, 1, "1 template clone exists");
		assert.strictEqual(this.oColumn._aTemplateClones[0], oTemplateClone, "A reference to the template clone is stored");
		assert.strictEqual(oTemplateClone.data("sap-ui-colindex"), 5, "The template has the correct \"colindex\" data");
		assert.strictEqual(oTemplateClone.data("sap-ui-colid"), this.oColumn.getId(), "The template has the correct \"colid\" data");
		assert.ok(oGetFreeTemplateCloneSpy.calledOnce, "Column#_getFreeTemplateClone has been called once");
		assert.ok(oGetTemplateSpy.calledOnce, "Column#getTemplate has been called once");
		assert.ok(oControlCloneSpy.calledOnce, "Template#clone has been called once");
	});

	QUnit.test("getTemplateClone: Only used template clones exist -> Create a new template clone", function(assert) {
		var oTemplate = new sap.m.Text();
		this.oColumn.setTemplate(oTemplate);
		sinon.stub(this.oColumn.getTemplateClone(0), "getParent").returns("i have a parent");

		var oGetFreeTemplateCloneSpy = sinon.spy(this.oColumn, "_getFreeTemplateClone");
		var oGetTemplateSpy = sinon.spy(this.oColumn, "getTemplate");
		var oControlCloneSpy = sinon.spy(oTemplate, "clone");

		var oTemplateClone = this.oColumn.getTemplateClone(5);

		assert.notEqual(oTemplateClone, null, "Returned the created template clone");
		assert.strictEqual(this.oColumn._aTemplateClones.length, 2, "2 template clones exist");
		assert.strictEqual(this.oColumn._aTemplateClones[1], oTemplateClone, "A reference to the template clone is stored");
		assert.strictEqual(oTemplateClone.data("sap-ui-colindex"), 5, "The template has the correct \"colindex\" data");
		assert.strictEqual(oTemplateClone.data("sap-ui-colid"), this.oColumn.getId(), "The template has the correct \"colid\" data");
		assert.ok(oGetFreeTemplateCloneSpy.calledOnce, "Column#_getFreeTemplateClone has been called once");
		assert.ok(oGetTemplateSpy.calledOnce, "Column#getTemplate has been called once");
		assert.ok(oControlCloneSpy.calledOnce, "Template#clone has been called once");
	});

	QUnit.test("getTemplateClone: Reuse a free template clone", function(assert) {
		var oTemplate = new sap.m.Text();
		this.oColumn.setTemplate(oTemplate);
		sinon.stub(this.oColumn.getTemplateClone(0), "getParent").returns("i have a parent");
		var oFreeTemplateClone = this.oColumn.getTemplateClone(1);
		sinon.stub(oFreeTemplateClone, "getParent").returns("i have a parent");
		sinon.stub(this.oColumn.getTemplateClone(2), "getParent").returns("i have a parent");
		sinon.restore(oFreeTemplateClone);

		var oGetFreeTemplateCloneSpy = sinon.spy(this.oColumn, "_getFreeTemplateClone");
		var oGetTemplateSpy = sinon.spy(this.oColumn, "getTemplate");
		var oControlCloneSpy = sinon.spy(oTemplate, "clone");

		var oTemplateClone = this.oColumn.getTemplateClone(5);

		assert.strictEqual(oTemplateClone, oFreeTemplateClone, "Returned the free template clone");
		assert.strictEqual(this.oColumn._aTemplateClones.length, 3, "3 template clones exist");
		assert.strictEqual(this.oColumn._aTemplateClones[1], oTemplateClone, "A reference to the template clone is stored");
		assert.strictEqual(oTemplateClone.data("sap-ui-colindex"), 5, "The template has the correct \"colindex\" data");
		assert.strictEqual(oTemplateClone.data("sap-ui-colid"), this.oColumn.getId(), "The template has the correct \"colid\" data");
		assert.ok(oGetFreeTemplateCloneSpy.calledOnce, "Column#_getFreeTemplateClone has been called once");
		assert.ok(oGetTemplateSpy.notCalled, "Column#getTemplate has not been called");
		assert.ok(oControlCloneSpy.notCalled, "Template#clone has not been called");
	});

	QUnit.test("_destroyTemplateClones", function(assert) {
		this.oColumn._aTemplateClones = [
			null,
			this.oCloneWithParent,
			this.oCloneWithoutParentA,
			this.oDestroyedClone,
			this.oCloneWithoutParentB
		];

		var oCloneWithParentDestroySpy = sinon.spy(this.oCloneWithParent, "destroy");
		var oCloneWithoutParentADestroySpy = sinon.spy(this.oCloneWithoutParentA, "destroy");

		this.oColumn._destroyTemplateClones();

		assert.ok(
			oCloneWithParentDestroySpy.calledOnce
			&& oCloneWithoutParentADestroySpy.calledOnce
			&& oCloneWithoutParentADestroySpy.calledOnce,
			"Template clones have been destroyed"
		);
		assert.deepEqual(this.oColumn._aTemplateClones, [], "The clone stack has been cleared");
	});

	QUnit.test("Setting a column template", function(assert) {
		this.oColumn._aTemplateClones = [
			null,
			this.oCloneWithParent,
			this.oCloneWithoutParentA,
			this.oDestroyedClone,
			this.oCloneWithoutParentB
		];

		var oCloneWithParentDestroySpy = sinon.spy(this.oCloneWithParent, "destroy");
		var oCloneWithoutParentADestroySpy = sinon.spy(this.oCloneWithoutParentA, "destroy");

		this.oColumn.setTemplate(new sap.m.Text());

		assert.ok(
			oCloneWithParentDestroySpy.calledOnce
			&& oCloneWithoutParentADestroySpy.calledOnce
			&& oCloneWithoutParentADestroySpy.calledOnce,
			"Template clones have been destroyed"
		);
		assert.deepEqual(this.oColumn._aTemplateClones, [], "The clone stack has been cleared");
	});

	QUnit.test("Destruction of the column", function(assert) {
		this.oColumn._aTemplateClones = [
			null,
			this.oCloneWithParent,
			this.oCloneWithoutParentA,
			this.oDestroyedClone,
			this.oCloneWithoutParentB
		];

		var oCloneWithParentDestroySpy = sinon.spy(this.oCloneWithParent, "destroy");
		var oCloneWithoutParentADestroySpy = sinon.spy(this.oCloneWithoutParentA, "destroy");

		this.oColumn.destroy();

		assert.ok(
			oCloneWithParentDestroySpy.calledOnce
			&& oCloneWithoutParentADestroySpy.calledOnce
			&& oCloneWithoutParentADestroySpy.calledOnce,
			"Template clones have been destroyed"
		);
		assert.deepEqual(this.oColumn._aTemplateClones, [], "The clone stack has been cleared");
	});
});