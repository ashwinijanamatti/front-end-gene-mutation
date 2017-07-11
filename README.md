The website shows two different views on the Mutation dataset.

I use d3.json to load data from the API url provided.

Mutation Type View - shows the mutation type as a pie chart, the different pie slices are clickable

Chromosome View - shows the Chromosome as list of rectangles, all of them are clickable

Click on One of the Mutation Type to update the Chromosome View and vice versa

Selecting a chromosome after selecting a type will update both the views and vice versa(because filters to a list of the objects that 
have selected type and selected chromosome)

Limitations : 

 - Multiple Selections in one view is not supported
 - The website has been tested to work on Chrome browser version 59.0.3071.115
 - If you click on one of the views when there is only one element in each, it updates only the other view
    For example, if the views are updated for Single base Substitution and chromosome 2, and then you click on Single Base Substitution 
    , only the Chromosome View gets updated 
