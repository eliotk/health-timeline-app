### health timeline app - view and explore a timeline of health-related events

Live demo: http://www.eliotk.net/health-timeline-app/

#### Why?

I wanted to easily log and view health events structured as a timeline using a simple data format. Hopefully the C-CDA import capability will be beneficial for individuals and families loading in their own EHR-exported C-CDAs or perhaps providers using it to get an initial overview of a patient's history.

#### Getting started

My preferred way of building out the data is to use the [YAML format](http://www.yaml.org/start.html), which the event editor can interpret.

So in the Events teat area, you can create an event like this:

```
- content: Hospital Admit (UTI, dehydration)
  start: 2016-01-01
  end: 2016-03-01
  group_name: Hospitalizations
```

And then click "Save" and the timeline will update.

The bare-mimimum required fields/keys are:

* content (description of the event)
* start (date of event)
* group_name (category for the event)

The *end* field can be used to create a multi-day event.

You can include any number of additional, arbitrary fields in the event. These fields will be preserved and can be accessed from the event object. An example of a an event w/ additional fields:

```
- content: Morning hike
  start: 2016-01-02
  group_name: Exercise
  miles: 5
  location: Bear Mountain Park
```

To indicate that an event is ongoing and hasn't ended (e.g. for a current medication), set the *end* field to "ongoing":

```
- content: Propanolol
  start: 2016-01-02
  end: ongoing
  group_name: Meds
  prescriber: Dr. Dawes
```

You can also use JSON to describe the events:

```
[{
  'content': 'Influenza vaccine',
  'start': '2015-11-18',
  'group_name': 'Immunizations'
}]
```

For developers, since it's a simple client-side app w/ all assets already built, running it locally
is as easy as git cloning the repo:

`git clone git@github.com:eliotk/health-timeline-app.git .`

Then running a local static web server pointed at the repo dir like node's http-server:

```
npm install http-server -g
http-server
```

#### Is it secure?

Yes. All data is stored and handled in the browser. There are no remote push or pull operations.

#### Data persistence

Data is persisted in the browser's local storage (TODO: allow users to save data to the filesystem).

#### About C-CDA import

The following C-CDA section events can be imported:

* encounters
* immunizations
* medications
* problems
* procedures

#### Under the hood

* The fantastic [vis.js library](http://visjs.org/) for the timeline visualization
* The wonderful [BlueButton.js](bluebuttonjs.com) library to process the C-CDA XML into json.
* The [CHB-collected sample CCDAs repo](https://github.com/chb/sample_ccdas) for testing the import
* [js-yaml](https://github.com/nodeca/js-yaml) for processing events in the YAML format

#### Changelog

* 2016-01-18: Add search functionality to filter events in timeline
* 2016-01-03: It's up on Github!
